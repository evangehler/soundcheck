# app/utils/email.py
# Utility functions for sending emails

import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os
import traceback


load_dotenv()
email_address = os.getenv("EMAIL_ADDRESS")
email_password = os.getenv("EMAIL_PASSWORD")
email_enabled = os.getenv("EMAIL_ENABLED",'False') == 'True'


print(f"EMAIL_ADDRESS: {email_address}")
print(f"EMAIL_PASSWORD: {email_password}")

# Function to send a welcome email to a new user
def sendEmail(reciever: str, user: str):
    msg = EmailMessage()
    msg["Subject"] = "Thanks for signing up at soundcheck!"
    msg["From"] = email_address
    msg["To"] = reciever
    msg.set_content(f"""Hello {user}, thank you for signing up at soundcheck! 
    Your account has been successfully created. You're ready to start reviewing albums. Have fun!""")
    if not email_enabled:
        print("Email sending is disabled in .env")
        return
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(email_address, email_password)
            smtp.send_message(msg)
            print("Email sent!")
    except Exception:
        print("Email could not be sent!")
        traceback.print_exc()

sendEmail('ruhmatt1973@gmail.com', 'ruhmatt1973')


