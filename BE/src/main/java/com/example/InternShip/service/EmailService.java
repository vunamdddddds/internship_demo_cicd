package com.example.InternShip.service;

import com.example.InternShip.entity.InternshipApplication;
import com.example.InternShip.entity.Sprint;
import com.example.InternShip.entity.Task;

import java.util.List;

public interface EmailService {
    void sendApplicationStatusEmail(InternshipApplication application);

    void sendSprintCompletionEmail(Sprint sprint, List<Task> completedTasks, List<Task> incompleteTasks);

    void sendNewSprintNotificationEmail(Sprint sprint);
}
