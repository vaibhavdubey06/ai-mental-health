interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const therapeuticResponses = {
  greeting: [
    "It's wonderful that you're here. Taking the time to check in with yourself shows real self-awareness. What's been on your mind lately?",
    "I'm glad you decided to reach out today. Creating space for our thoughts and feelings is so important. How are you feeling right now?",
    "Thank you for being here. I can sense that you're making an effort to connect with yourself, and that takes courage. What would you like to explore today?"
  ],
  
  anxiety: [
    "It sounds like you're experiencing some anxiety, and that can feel really overwhelming. Remember that anxiety is your mind trying to protect you, even though it doesn't always feel helpful. What do you think might be contributing to these feelings?",
    "I hear that you're feeling anxious. That's a completely valid experience, and you're not alone in feeling this way. Sometimes it helps to ground ourselves in the present moment. Can you tell me about something you can see, hear, or feel right now?",
    "Anxiety can feel so intense and consuming. I want you to know that what you're experiencing is real and valid. Have you noticed any patterns in when these feelings tend to arise?"
  ],
  
  sadness: [
    "I can hear the sadness in what you're sharing, and I want you to know that it's okay to feel this way. Sadness often comes when something meaningful to us has been affected. Would you feel comfortable sharing what's been weighing on your heart?",
    "It takes strength to acknowledge and sit with difficult emotions like sadness. I'm here with you in this moment. Sometimes sadness is our heart's way of processing something important. What do you think your sadness might be telling you?",
    "Thank you for trusting me with your sadness. These feelings can feel so heavy, but you don't have to carry them alone. What kind of support feels most helpful to you right now?"
  ],
  
  stress: [
    "It sounds like you're dealing with a lot of stress right now. When we're overwhelmed, it can feel like everything is urgent and demanding our attention at once. What feels like the most pressing concern for you today?",
    "Stress can make everything feel more difficult and intense. I want to acknowledge how hard you're working to manage everything on your plate. What would it feel like to give yourself permission to slow down, even just for a moment?",
    "I hear that you're feeling stressed, and that must be exhausting. Sometimes stress is our body and mind's way of telling us we need support or a different approach. What do you think you need most right now?"
  ],
  
  anger: [
    "I can sense there's some anger here, and anger often carries important information about our boundaries and values. It's okay to feel angry - it's a valid emotion. What do you think your anger might be trying to tell you?",
    "Anger can feel so intense and sometimes frightening, but it's often protecting something important to us. Thank you for sharing this with me. What feels most important for you to be heard about right now?",
    "I hear your anger, and I want you to know that it's completely valid to feel this way. Anger often arises when something we care about has been threatened or hurt. What matters most to you in this situation?"
  ],
  
  lonely: [
    "Loneliness can feel so isolating and painful. I want you to know that even though you might feel alone, you're not truly alone - I'm here with you right now. What does loneliness feel like for you?",
    "I hear that you're feeling lonely, and that's such a difficult emotion to sit with. Loneliness often tells us about our deep human need for connection. What kind of connection do you find yourself longing for?",
    "Thank you for sharing about your loneliness with me. It takes vulnerability to name that feeling. Even in this moment, you're reaching out and connecting, which shows real courage. What small step toward connection might feel possible today?"
  ],
  
  general: [
    "I'm listening, and I can hear that there's something important you're working through. Take your time - there's no rush. What feels most important for you to share right now?",
    "Thank you for trusting me with what's on your mind. I can sense that you're reflecting deeply on your experience. What would it be like to approach yourself with the same kindness you'd show a good friend?",
    "I appreciate you taking the time to check in with yourself. Self-reflection takes courage and shows real commitment to your wellbeing. What are you noticing about yourself in this moment?",
    "What you're sharing sounds really important, and I want to make sure I understand. Sometimes it helps to slow down and really notice what we're experiencing. What emotions are coming up for you as you think about this?",
    "I can hear that you're processing something significant. It's okay to take your time with difficult thoughts and feelings. What would feel most supportive for you right now?"
  ],
  
  encouragement: [
    "I want to reflect back something I'm noticing - you're showing real strength and self-awareness by being here and exploring these feelings. That's not always easy to do.",
    "It sounds like you're being really thoughtful about your experience, and that kind of self-reflection is a gift you're giving yourself. How does it feel to take this time for yourself?",
    "I'm struck by your willingness to be open and honest about what you're going through. That takes real courage, and I hope you can acknowledge that strength in yourself."
  ]
};

export const generateTherapistResponse = (userMessage: string, conversationHistory: ChatMessage[]): string => {
  const message = userMessage.toLowerCase();
  
  // Detect emotional keywords
  const anxietyKeywords = ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'overwhelmed', 'stressed out'];
  const sadnessKeywords = ['sad', 'depressed', 'down', 'upset', 'crying', 'tears', 'heartbroken', 'grief'];
  const stressKeywords = ['stress', 'stressed', 'pressure', 'busy', 'overwhelmed', 'exhausted', 'tired'];
  const angerKeywords = ['angry', 'mad', 'furious', 'frustrated', 'irritated', 'annoyed'];
  const lonelyKeywords = ['lonely', 'alone', 'isolated', 'disconnected', 'empty'];
  
  // Check for greeting/first interaction
  if (conversationHistory.length <= 1) {
    return getRandomResponse(therapeuticResponses.greeting);
  }
  
  // Check for specific emotional content
  if (anxietyKeywords.some(keyword => message.includes(keyword))) {
    return getRandomResponse(therapeuticResponses.anxiety);
  }
  
  if (sadnessKeywords.some(keyword => message.includes(keyword))) {
    return getRandomResponse(therapeuticResponses.sadness);
  }
  
  if (stressKeywords.some(keyword => message.includes(keyword))) {
    return getRandomResponse(therapeuticResponses.stress);
  }
  
  if (angerKeywords.some(keyword => message.includes(keyword))) {
    return getRandomResponse(therapeuticResponses.anger);
  }
  
  if (lonelyKeywords.some(keyword => message.includes(keyword))) {
    return getRandomResponse(therapeuticResponses.lonely);
  }
  
  // Occasionally add encouragement
  if (Math.random() < 0.3) {
    return getRandomResponse(therapeuticResponses.encouragement);
  }
  
  // Default to general therapeutic responses
  return getRandomResponse(therapeuticResponses.general);
};

const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};