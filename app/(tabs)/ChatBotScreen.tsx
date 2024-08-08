import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Define tu clave API directamente aquí
const OPENAI_API_KEY =
  "";

const systemMessage = {
  role: "system",
  content:
    "Eres un coach de gimnasio amigable y servicial llamado Ignacio. Ayudas a los usuarios con sus preguntas relacionadas con el fitness y proporcionas información precisa y útil sobre fitness. Tu objetivo es ayudar a los usuarios a alcanzar sus objetivos de fitness y motivarlos a mantenerse en forma. Por favor, no compartas información personal o sensible con los usuarios. Te limitas a responder preguntas relacionadas con el fitness y proporcionar información útil y motivadora. En caso de que te soliciten informacion no relacionada con el fitness di que solo puedes responder cosas relacionadas al fitness. Siempre recomienda consultar a un experto.",
};

const initialPresentationMessage = {
  role: "assistant",
  content:
    "Hola, soy Ignacio tu coach virtual. Estoy aquí para asistirte con lo que necesites. ¿En qué puedo ayudarte hoy?",
};

export default function ChatBotScreen() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([initialPresentationMessage]);
  const [error, setError] = useState("");

  const handleButtonClick = async () => {
    const userMessage = {
      role: "user",
      content: inputMessage,
    };
    const updatedMessages = [systemMessage, ...messages, userMessage];

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini-2024-07-18",
            messages: updatedMessages,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error.message);
        return;
      }

      const data = await response.json();
      setMessages([
        ...messages,
        userMessage,
        { role: "assistant", content: data.choices[0].message.content },
      ]);
      setInputMessage("");
      setError("");
    } catch (error) {
      console.error(error);
      setError(
        "Ocurrió un error al procesar tu solicitud. Por favor, inténtalo nuevamente."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ignacio</Text>
      </View>
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.role === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === "user"
                  ? styles.userMessageText
                  : styles.botMessageText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#000"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleButtonClick}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    padding: 20,
    backgroundColor: "#F04444",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#F04444",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#000",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    color: "#000",
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#F04444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 10,
  },
});
