import { message } from "antd";
import React, { useEffect, useState } from "react";
import { controller } from "../assets/controller/controller";
import yourSound from '../assets/sound/notif.mp3';
import { updateAtom, updateUserAtom } from '../store';
import { useAtom } from 'jotai';

const NotificationComponent = (props) => {
  const [update, setUpdate] = useAtom(updateAtom);
  const [updateUser, setUpdateUser] = useAtom(updateUserAtom);
  const [userId, setUserId] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [isUserInteracted, setIsUserInteracted] = useState(false); // Track user interaction

  const getUserId = async () => {
    const response = await controller.checkAdminUser();
    console.log(response.json.user_id);
    setUserId(response.json.user_id);

    const ws = new WebSocket(
      !response.json.detail
        ? "wss://back.shahedgold.com/ws/stream/" + response.json.user_id + "/"
        : "wss://back.shahedgold.com/ws/admin/"
    );

    setWebSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (e) => {
      e.preventDefault();
      const data = JSON.parse(e.data);
      console.log("Message received:", data);

      // Correct way to toggle state based on previous value
      setUpdate(prev => !prev);

      // Play sound when message is received
      const audio = new Audio(yourSound);

      // If the user hasn't interacted yet, we mark the interaction so sound can be played
      if (!isUserInteracted) {
        setIsUserInteracted(true);
      }

      // Play the sound after interaction
      if (isUserInteracted) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }

      if (data === "price updated" && typeof props.updatePrice === "function") {
        console.log("Calling updatePrice function...");
        // props.updatePrice();
      }

      if (response.json.detail && data !== "price updated") {
        message.info(data);

        if (props.handleUpdateList) {
          props.handleUpdateList();
        }

        var notification = new Notification("یک سفارش جدید دریافت شد");
        notification.onclick = (event) => {
          event.preventDefault();
          window.open(window.location.origin + "/order-management", "_blank");
        };
      } else {
        setUpdateUser(prev => !prev);

      }
    };

    ws.onerror = (e) => {
      console.error("WebSocket Error", e);
    };

    ws.onclose = (e) => {
      console.log("WebSocket Disconnected", e);
    };

    return () => {
      ws.close();
    };
  };

  useEffect(() => {
    getUserId();
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      window.Notification.requestPermission();
    }
  }, []);

  // Just return an empty fragment instead of any clickable element
  return <></>;
};

export default NotificationComponent;
