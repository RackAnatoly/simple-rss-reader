import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import { useAppState } from "../context/AppStateContext";
import { Feed } from "../types";

interface AddFeedModalProps {
  visible: boolean;
  onDismiss: () => void;
  editFeed?: Feed;
}

export function AddFeedModal({
  visible,
  onDismiss,
  editFeed
}: AddFeedModalProps) {
  const { dispatch } = useAppState();
  const [title, setTitle] = useState(editFeed?.title || "");
  const [url, setUrl] = useState(editFeed?.url || "");
  const [error, setError] = useState("");

  const isEditing = !!editFeed;

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onDismiss();
  };

  const validateUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!url.trim() || !validateUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    const feed: Feed = {
      id: editFeed?.id || uuidv4(),
      title: title.trim(),
      url: url.trim(),
      added: editFeed?.added || Date.now()
    };

    if (isEditing) {
      dispatch({ type: "UPDATE_FEED", payload: feed });
    } else {
      dispatch({ type: "ADD_FEED", payload: feed });
    }

    resetForm();
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isEditing ? "Edit Feed" : "Add New Feed"}
          </Text>

          <TextInput
            label="Feed Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Feed URL"
            value={url}
            onChangeText={setUrl}
            style={styles.input}
            mode="outlined"
            placeholder="https://example.com/rss"
            keyboardType="url"
            autoCapitalize="none"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={handleClose} style={styles.button}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15
  },
  input: {
    width: "100%",
    marginBottom: 15
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10
  },
  button: {
    width: "48%"
  },
  errorText: {
    color: "red",
    marginBottom: 10
  }
});
