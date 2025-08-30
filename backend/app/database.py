from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient = None
    database = None


db = Database()


async def get_database():
    """Get database connection, ensure it's available"""
    try:
        # If database is None, try to reconnect
        if db.database is None:
            logger.warning("Database connection is None, attempting to reconnect...")
            await connect_to_mongo()
        
        # Double check if connection was successful
        if db.database is None:
            logger.error("Failed to establish database connection")
            return None
            
        # Test if the connection is still alive with a simple operation
        try:
            await db.client.admin.command('ping')
            return db.database
        except Exception as ping_error:
            logger.warning(f"Database ping failed, reconnecting: {ping_error}")
            await connect_to_mongo()
            return db.database
            
    except Exception as e:
        logger.error(f"Error getting database connection: {e}")
        return None


async def connect_to_mongo():
    """Create database connection with event loop safety"""
    try:
        logger.info(f"Attempting to connect to MongoDB...")
        logger.info(f"MongoDB URI (first 50 chars): {settings.mongodb_uri[:50]}...")
        
        # Close existing connection if any
        if db.client:
            try:
                db.client.close()
            except:
                pass
        
        # Create new connection with serverless-friendly settings
        db.client = AsyncIOMotorClient(
            settings.mongodb_uri,
            maxPoolSize=1,  # Limit pool size for serverless
            minPoolSize=0,  # Allow connections to close
            maxIdleTimeMS=30000,  # Close idle connections quickly
            connectTimeoutMS=10000,  # Faster timeout
            serverSelectionTimeoutMS=10000,  # Faster server selection
        )
        db.database = db.client[settings.database_name]
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info(f"✅ Successfully connected to MongoDB database: {settings.database_name}")
        
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        db.client = None
        db.database = None
        logger.error(f"Error type: {type(e).__name__}")
        # Don't raise in production - let the application continue without database
        if settings.environment == "production":
            logger.warning("⚠️ Continuing without database in production mode")
            db.client = None
            db.database = None
        else:
            raise


async def close_mongo_connection():
    """Close database connection"""
    try:
        if db.client:
            db.client.close()
            logger.info("✅ Closed MongoDB connection")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {e}")
    finally:
        db.client = None
        db.database = None
        logger.info("Disconnected from MongoDB")


# Collection names
INSIGHTS_COLLECTION = "insights"
USERS_COLLECTION = "users"
