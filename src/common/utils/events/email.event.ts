import { EventEmitter } from "node:events";
import { template } from "../email/htmlEmail";
import { EmailEvent, SubjectEnum } from "../email/emailSubjectEnum";
import { sendEmail } from "../email/sendEmail";

export const emailEvents = new EventEmitter();

emailEvents.on(EmailEvent.ConfirmEmail, async (data) => {
  try {
    data.subject = SubjectEnum.ConfirmEmail;
    data.html = template(data.otp, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.log("Fail to send email", error);
  }
});
emailEvents.on(EmailEvent.ResetPassword, async (data) => {
  try {
    data.subject = SubjectEnum.ResetPassword;
    data.html = template(data.otp, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send reset password email", error);
  }
});

emailEvents.on(EmailEvent.Welcome, async (data) => {
  try {
    data.subject = SubjectEnum.Welcome;
    data.html = template(null as any, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send welcome email", error);
  }
});
emailEvents.on(EmailEvent.ChangePassword, async (data) => {
  try {
    data.subject = SubjectEnum.ChangePassword;
    data.html = template(null as any, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.error("Fail to send change password email", error);
  }
});
