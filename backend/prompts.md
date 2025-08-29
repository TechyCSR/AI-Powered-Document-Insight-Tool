# AI Provider Prompts for Resume Analysis

## Overview
This document contains the standardized prompts and response formats for AI providers to analyze resumes consistently and professionally.

## Response Format Requirements

### 1. Structure
All AI responses must follow this exact format:
```
**Professional Summary:** [2-3 concise sentences highlighting key qualifications]

**Key Skills:** [Comma-separated list of technical and soft skills]

**Experience Highlights:** [2-3 bullet points of most relevant experience]

**Education:** [Degree, institution, GPA if mentioned]

**Notable Achievements:** [2-3 most impressive accomplishments]
```

### 2. Content Guidelines
- **Professional Summary**: 2-3 sentences maximum, focus on current role, key skills, and impact
- **Key Skills**: Extract 8-12 most relevant technical and soft skills
- **Experience Highlights**: Focus on quantifiable achievements and responsibilities
- **Education**: Keep brief, include GPA only if above 7.0
- **Notable Achievements**: Highlight competitive coding, hackathons, leadership roles

### 3. Tone and Style
- Professional and business-like
- Use active voice
- Quantify achievements where possible (e.g., "handling 10,000+ daily queries")
- Avoid technical jargon unless essential
- Focus on business value and impact

## Provider-Specific Instructions

### Sarvam AI
- **Model**: sarvam-m
- **Temperature**: 0.2 (for consistent, focused output)
- **Reasoning Effort**: low (to avoid verbose thinking process)
- **Max Tokens**: 1000
- **Important**: Do NOT include internal reasoning or `<think>` tags in output

### Gemini AI
- **Model**: gemini-1.5-pro
- **Temperature**: 0.3 (for balanced creativity and consistency)
- **Max Output Tokens**: 1000
- **Top P**: 0.8

## Example Output Format

```
**Professional Summary:**  
John Doe is a Software Engineer with 5 years of experience in full-stack web development, specializing in Python, JavaScript, and cloud technologies. He has successfully delivered scalable applications handling 100,000+ users and led cross-functional teams of 8 developers.

**Key Skills:**  
Python, JavaScript, React, Node.js, AWS, Docker, Git, Agile, Team Leadership, Problem Solving

**Experience Highlights:**  
• Led development of e-commerce platform serving 100,000+ users with 99.9% uptime
• Managed team of 8 developers, improving delivery time by 30%
• Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes

**Education:**  
Bachelor's in Computer Science, University of Technology, GPA: 3.8/4.0

**Notable Achievements:**  
• Won Best Developer Award at Tech Innovation Summit 2024
• Led university coding club with 200+ members
• Completed AWS Solutions Architect certification
```

## Error Handling
If AI analysis fails, return this fallback format:
```
**Professional Summary:**  
Document processed successfully. AI analysis unavailable.

**Key Skills:**  
[Extracted from frequency analysis]

**Experience Highlights:**  
[Based on text content]

**Education:**  
[Extracted from text]

**Notable Achievements:**  
[Extracted from text]
```

## Content Processing Rules
1. **Text Length**: Send complete PDF text (no truncation)
2. **Context**: Provide full resume content for comprehensive analysis
3. **Formatting**: Preserve structure but clean up for readability
4. **Language**: Support multiple languages (Sarvam excels at Indian languages)
5. **Validation**: Ensure response follows required format exactly
```
