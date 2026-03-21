#!/usr/bin/env python3
"""
Corona Detection Terminal System
Simple terminal app that detects Corona symptoms and sends SMS alerts to doctor
"""

import os
import re
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class CoronaDetector:
    def __init__(self):
        # Twilio setup
        self.twilio_client = Client(
            os.getenv("TWILIO_ACCOUNT_SID"),
            os.getenv("TWILIO_AUTH_TOKEN")
        )
        
        # Get the correct phone number from your Twilio account
        try:
            phone_numbers = self.twilio_client.incoming_phone_numbers.list()
            if phone_numbers:
                self.twilio_number = phone_numbers[0].phone_number
                print(f"Using Twilio number: {self.twilio_number}")
            else:
                self.twilio_number = os.getenv("TWILIO_PHONE_NUMBER", "+14155238886")
                print(f"Using fallback number: {self.twilio_number}")
        except Exception as e:
            print(f"Could not fetch Twilio numbers: {e}")
            self.twilio_number = os.getenv("TWILIO_PHONE_NUMBER", "+14155238886")
        
        self.doctor_number = "+917617674620"
        
        # Dangerous diseases with symptoms (English and Hindi)
        self.dangerous_diseases = {
            "corona": {
                "english": [
                    "fever", "cough", "dry cough", "breathing problem", "shortness of breath",
                    "loss of taste", "loss of smell", "body ache", "fatigue", "tired",
                    "sore throat", "headache", "chills", "covid", "corona", "difficulty breathing"
                ],
                "hindi": [
                    "bukhar", "khansi", "sukhi khansi", "sans", "sans lene mein takleef",
                    "swad nahi", "gandh nahi", "badan dard", "thakan", "kamzori",
                    "gala dard", "sir dard", "thand lagna", "covid", "corona"
                ],
                "severity": "HIGH",
                "alert_type": "*** CORONA ALERT ***"
            },
            "dengue": {
                "english": [
                    "high fever", "severe headache", "eye pain", "muscle pain", "joint pain",
                    "rash", "bleeding", "dengue", "platelet", "nausea", "vomiting"
                ],
                "hindi": [
                    "tez bukhar", "sir dard", "ankh dard", "mansapeshi dard", "jodon mein dard",
                    "dane", "khoon", "dengue", "platelet", "ulti", "ji michlana"
                ],
                "severity": "HIGH",
                "alert_type": "*** DENGUE ALERT ***"
            },
            "heart_attack": {
                "english": [
                    "chest pain", "heart pain", "left arm pain", "jaw pain", "shoulder pain",
                    "sweating", "nausea", "dizziness", "shortness of breath", "heart attack"
                ],
                "hindi": [
                    "chati dard", "dil dard", "bayen hath dard", "jabde dard", "kandhe dard",
                    "pasina", "ulti", "chakkar", "sans fulna", "heart attack"
                ],
                "severity": "CRITICAL",
                "alert_type": "*** HEART ATTACK EMERGENCY ***"
            },
            "stroke": {
                "english": [
                    "sudden weakness", "face drooping", "speech difficulty", "confusion",
                    "severe headache", "dizziness", "loss of balance", "stroke"
                ],
                "hindi": [
                    "achanak kamzori", "chehra tedha", "bolne mein dikkat", "bhram",
                    "tez sir dard", "chakkar", "santulan khona", "stroke"
                ],
                "severity": "CRITICAL",
                "alert_type": "*** STROKE EMERGENCY ***"
            },
            "diabetes_emergency": {
                "english": [
                    "very high sugar", "excessive thirst", "frequent urination", "blurred vision",
                    "diabetic coma", "ketoacidosis", "fruity breath"
                ],
                "hindi": [
                    "bahut zyada sugar", "bahut pyas", "bar bar peshab", "dhundhla dikhna",
                    "diabetic coma", "sans mein phal ki gandh"
                ],
                "severity": "HIGH",
                "alert_type": "*** DIABETES EMERGENCY ***"
            }
        }
    
    def detect_dangerous_diseases(self, query):
        """Detect if query contains symptoms of dangerous diseases"""
        query_lower = query.lower()
        
        detected_diseases = []
        
        for disease_name, disease_info in self.dangerous_diseases.items():
            matched_symptoms = []
            total_symptoms = 0
            
            for symptom in disease_info["english"]:
                if symptom in query_lower:
                    matched_symptoms.append(symptom)
                    total_symptoms += 1
            
            for symptom in disease_info["hindi"]:
                if symptom in query:
                    matched_symptoms.append(symptom)
                    total_symptoms += 1
            
            max_possible = len(disease_info["english"]) + len(disease_info["hindi"])
            confidence = (total_symptoms / max_possible) * 100
            
            threshold = 15 if disease_info["severity"] == "CRITICAL" else 10
            is_possible = total_symptoms >= 2 or confidence > threshold
            
            if is_possible:
                detected_diseases.append({
                    "disease": disease_name,
                    "confidence": confidence,
                    "matched_symptoms": matched_symptoms,
                    "symptom_count": total_symptoms,
                    "severity": disease_info["severity"],
                    "alert_type": disease_info["alert_type"]
                })
        
        detected_diseases.sort(key=lambda x: x["confidence"], reverse=True)
        return detected_diseases
    
    def send_doctor_alert(self, user_query, detected_diseases):
        """Send SMS alert to doctor for detected diseases"""
        
        if not detected_diseases:
            return False
        
        primary_disease = detected_diseases[0]
        
        disease_name = primary_disease["disease"].upper().replace("_", " ")
        confidence = primary_disease["confidence"]
        severity = primary_disease["severity"]
        symptoms = ", ".join(primary_disease["matched_symptoms"][:5])
        alert_type = primary_disease["alert_type"]
        
        if severity == "CRITICAL":
            urgency = "*** CRITICAL EMERGENCY ***"
            action = "IMMEDIATE ACTION REQUIRED - CALL PATIENT NOW!"
        else:
            urgency = "*** HIGH PRIORITY ALERT ***"
            action = "Please contact patient as soon as possible."
        
        alert_message = f"""{urgency}
{alert_type} - Swasthya Suchak

PATIENT QUERY: "{user_query[:100]}..."

DISEASE: {disease_name}
CONFIDENCE: {confidence:.1f}%
SEVERITY: {severity}

SYMPTOMS: {symptoms}
SYMPTOM COUNT: {primary_disease["symptom_count"]}

{action}

Time: {self.get_current_time()}

--- Swasthya Suchak Health Monitor ---"""

        try:
            message = self.twilio_client.messages.create(
                body=alert_message,
                from_=self.twilio_number,
                to=self.doctor_number
            )
            print(f"Doctor alert sent for {disease_name}!")
            print(f"SMS ID: {message.sid}")
            return True
            
        except Exception as e:
            print(f"Failed to send doctor alert: {e}")
            return False
    
    def get_current_time(self):
        """Get current time string"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def process_query(self, query):
        """Process user query and send alert if needed"""
        
        print(f"\nAnalyzing query: \"{query}\"")
        print("-" * 50)
        
        detected_diseases = self.detect_dangerous_diseases(query)
        
        if detected_diseases:
            print(f"Analysis Results:")
            
            for i, disease in enumerate(detected_diseases, 1):
                disease_name = disease["disease"].upper().replace("_", " ")
                print(f"\n{i}. {disease_name}:")
                print(f"   Confidence: {disease['confidence']:.1f}%")
                print(f"   Severity: {disease['severity']}")
                print(f"   Symptoms: {', '.join(disease['matched_symptoms'])}")
                print(f"   Count: {disease['symptom_count']}")
            
            primary_disease = detected_diseases[0]
            disease_name = primary_disease["disease"].upper().replace("_", " ")
            
            print(f"\n{primary_disease['alert_type']} DETECTED!")
            print(f"   Primary Disease: {disease_name}")
            print(f"   Confidence: {primary_disease['confidence']:.1f}%")
            print(f"   Severity: {primary_disease['severity']}")
            
            if primary_disease["severity"] == "CRITICAL":
                print(f"   CRITICAL - EMERGENCY ALERT!")
            
            print(f"   Sending alert to doctor...")
            
            alert_sent = self.send_doctor_alert(query, detected_diseases)
            
            if alert_sent:
                print(f"Doctor has been notified via SMS")
                if primary_disease["severity"] == "CRITICAL":
                    print(f"EMERGENCY: Doctor should call patient immediately!")
            else:
                print(f"Failed to notify doctor")
                
        else:
            print(f"Analysis Results:")
            print(f"   No dangerous diseases detected")
            print(f"\nQuery seems normal - no alerts needed")
        
        return detected_diseases

def main():
    """Main function"""
    print("Swasthya Suchak - Multi-Disease Detection Terminal System")
    print("=" * 50)
    print("Detects: Corona, Dengue, Heart Attack, Stroke, Diabetes Emergency")
    print("Enter health queries to check for dangerous diseases")
    print("Type 'quit' or 'exit' to stop")
    print("=" * 50)
    
    detector = CoronaDetector()
    
    print("Testing Twilio connection...")
    try:
        account = detector.twilio_client.api.account.fetch()
        print(f"Twilio connected: {account.friendly_name}")
    except Exception as e:
        print(f"Twilio connection failed: {e}")
        print("Check your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env file")
        return
    
    print(f"Doctor alert number: {detector.doctor_number}")
    print(f"Twilio number: {detector.twilio_number}")
    print()
    
    while True:
        try:
            query = input("Enter health query: ").strip()
            
            if query.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not query:
                continue
            
            detector.process_query(query)
            
            print("\n" + "="*50)
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")

def show_examples():
    """Show example queries for testing"""
    examples = {
        "Corona": [
            "I have fever, cough and loss of taste",
            "Breathing problem, no taste or smell"
        ],
        "Dengue": [
            "High fever, severe headache, eye pain, muscle pain",
            "I have dengue symptoms with rash and bleeding"
        ],
        "Heart Attack": [
            "Severe chest pain, left arm pain, sweating, nausea",
            "I think I'm having a heart attack"
        ],
        "Stroke": [
            "Sudden weakness, face drooping, speech difficulty",
            "I can't speak properly, face feels numb"
        ],
        "Diabetes Emergency": [
            "Very high blood sugar, excessive thirst, blurred vision",
            "Diabetic emergency symptoms with fruity breath"
        ]
    }
    
    print("\nExample Test Queries:")
    print("=" * 30)
    for disease, queries in examples.items():
        print(f"\n{disease}:")
        for i, query in enumerate(queries, 1):
            print(f"  {i}. {query}")

if __name__ == "__main__":
    main()
