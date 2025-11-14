package com.example.InternShip.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatMessageResponse {
    private Long id;
    private Long conversationId;
    private Integer senderId;
    private String senderName;
    private String guestId;
    private String content;
    private LocalDateTime createdAt;
}
