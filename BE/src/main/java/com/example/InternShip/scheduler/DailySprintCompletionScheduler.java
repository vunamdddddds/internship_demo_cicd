package com.example.InternShip.scheduler;

import com.example.InternShip.service.SprintCompletionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DailySprintCompletionScheduler {

    private final SprintCompletionService sprintCompletionService;

    /**
     * This scheduler runs every day at 11:00 PM to check for sprints that have ended.
     * The cron expression is "second minute hour day-of-month month day-of-week".
     * "0 0 23 * * *" means at second 0, minute 0, of hour 23, on any day-of-month, any month, any day-of-week.
     */
    @Scheduled(cron = "0 0 23 * * *")
    public void scheduleSprintCompletionCheck() {
        log.info("Scheduler activated: Checking for finished sprints.");
        sprintCompletionService.processAndNotifyFinishedSprints();
    }
}
