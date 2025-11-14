package com.example.InternShip.dto.request;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private Long conversationId;
    private String content;
    private String guestId;
}
