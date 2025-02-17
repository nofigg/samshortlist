from typing import List, Dict
from twilio.rest import Client
from app.core.config import get_settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

settings = get_settings()

class NotificationService:
    def __init__(self):
        self.twilio_client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )

    async def send_email_notification(
        self,
        to_email: str,
        subject: str,
        content: str
    ) -> bool:
        """
        Send an email notification using SMTP
        """
        try:
            msg = MIMEMultipart()
            msg['From'] = "notifications@samshortlist.com"
            msg['To'] = to_email
            msg['Subject'] = subject

            msg.attach(MIMEText(content, 'html'))

            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)

            return True
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False

    async def send_sms_notification(
        self,
        to_number: str,
        message: str
    ) -> bool:
        """
        Send an SMS notification using Twilio
        """
        try:
            self.twilio_client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to_number
            )
            return True
        except Exception as e:
            print(f"Failed to send SMS: {str(e)}")
            return False

    async def notify_new_match(
        self,
        business: Dict,
        opportunity: Dict,
        match_score: float,
        notification_preferences: Dict
    ) -> None:
        """
        Notify a business about a new matching opportunity
        """
        # Email notification
        if notification_preferences.get('email'):
            email_content = f"""
            <h2>New Matching Opportunity Found!</h2>
            <p>Match Score: {match_score * 100:.1f}%</p>
            <h3>Opportunity Details:</h3>
            <ul>
                <li>Title: {opportunity['title']}</li>
                <li>Agency: {opportunity['agency']}</li>
                <li>Value: ${opportunity['contract_value']:,.2f}</li>
                <li>Deadline: {opportunity['response_deadline']}</li>
            </ul>
            <p><a href="https://samshortlist.com/opportunities/{opportunity['id']}">
                View Full Details
            </a></p>
            """
            
            await self.send_email_notification(
                to_email=notification_preferences['email'],
                subject="New Matching Opportunity - Sam Shortlist",
                content=email_content
            )

        # SMS notification
        if notification_preferences.get('sms'):
            sms_content = (
                f"New matching opportunity found!\n"
                f"Title: {opportunity['title']}\n"
                f"Match Score: {match_score * 100:.1f}%\n"
                f"Value: ${opportunity['contract_value']:,.2f}\n"
                f"View: https://samshortlist.com/opportunities/{opportunity['id']}"
            )
            
            await self.send_sms_notification(
                to_number=notification_preferences['sms'],
                message=sms_content
            )

    async def notify_deadline_reminder(
        self,
        business: Dict,
        opportunities: List[Dict],
        notification_preferences: Dict
    ) -> None:
        """
        Send reminders for upcoming opportunity deadlines
        """
        if not opportunities:
            return

        # Email notification
        if notification_preferences.get('email'):
            email_content = """
            <h2>Upcoming Opportunity Deadlines</h2>
            <p>The following opportunities are closing soon:</p>
            <ul>
            """
            
            for opp in opportunities:
                email_content += f"""
                <li>
                    <strong>{opp['title']}</strong><br>
                    Deadline: {opp['response_deadline']}<br>
                    <a href="https://samshortlist.com/opportunities/{opp['id']}">
                        View Details
                    </a>
                </li>
                """
            
            email_content += "</ul>"
            
            await self.send_email_notification(
                to_email=notification_preferences['email'],
                subject="Upcoming Deadlines - Sam Shortlist",
                content=email_content
            )

        # SMS notification
        if notification_preferences.get('sms'):
            sms_content = "Upcoming deadlines:\n\n"
            for opp in opportunities:
                sms_content += (
                    f"- {opp['title']}\n"
                    f"  Deadline: {opp['response_deadline']}\n"
                )
            
            await self.send_sms_notification(
                to_number=notification_preferences['sms'],
                message=sms_content
            )
