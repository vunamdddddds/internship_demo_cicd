package com.example.InternShip.service;

public interface SprintCompletionService {
    /**
     * Finds all sprints that ended today, processes them, and sends a summary email to the team.
     */
    void processAndNotifyFinishedSprints();
}
