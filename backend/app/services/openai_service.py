# app/services/openai_service.py
from typing import Dict, Any, Tuple
from openai import OpenAI
from app.core.config import settings

# Initialize the OpenAI client using the API key from settings
client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def correct_tweet(original_text: str) -> Tuple[str, str]:
    """
    Uses OpenAI API to correct grammar and provide explanations for the given text
    
    Args:
        original_text: The original text to correct
        
    Returns:
        A tuple of (corrected_text, explanation)
    """
    try:
        # Skip API call if no API key is configured
        if not settings.OPENAI_API_KEY:
            print("WARNING: No OpenAI API key found. Using echo mode.")
            return original_text, "No grammar correction available (API key not configured)."
        
        # Construct the prompt for OpenAI
        prompt = f"""
        You are a helpful language learning assistant. Correct the following English text, 
        fixing any grammar, spelling, or punctuation errors. Then explain the corrections you made.
        
        Original text: "{original_text}"
        
        Provide your response in JSON format with two fields:
        1. corrected_text: The corrected version
        2. explanation: A friendly explanation of the changes and why they improve the text
        
        Keep the original meaning and style. If the text is already correct, say so in the explanation.
        """
        
        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # You can adjust the model as needed
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are a language correction assistant that helps non-native English speakers improve their writing."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Lower temperature for more consistent corrections
            max_tokens=1000
        )
        
        # Extract the response
        response_content = response.choices[0].message.content
        
        # Parse the JSON response
        import json
        result = json.loads(response_content)
        
        corrected_text = result.get("corrected_text", original_text)
        explanation = result.get("explanation", "No explanation provided.")
        
        return corrected_text, explanation
        
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        # Fallback in case of error
        return original_text, f"Could not process correction: {str(e)}"

# Function to determine if a text needs correction
async def needs_correction(text: str) -> bool:
    """
    Determines if the given text needs grammatical correction
    This is a simplified version that always returns True
    In a production environment, you might want to implement more sophisticated logic
    """
    return True