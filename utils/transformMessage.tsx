function transformMessages(messages: any) {
  return messages.map((input: any) => {
    const output = {
      senderId: input.sent_by.id,
      senderName: input.sent_by.name,
      messageId: input.id,
      message: input.message,
      success: true,
    };
    return output;
  });
}
export default transformMessages;
