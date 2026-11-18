package com.excelr.taskmanager.controller;

import com.excelr.taskmanager.model.Project;
import com.excelr.taskmanager.model.Task;
import com.excelr.taskmanager.model.User;
import com.excelr.taskmanager.repository.ProjectRepository;
import com.excelr.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*") // Allows your React app to talk to this backend
public class ProjectController {
	@Autowired
	private com.excelr.taskmanager.repository.UserRepository userRepository;
	
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

 // Fetch ONLY the logged-in user's projects
    @GetMapping("/user/{userId}")
    public List<Project> getUserProjects(@PathVariable Long userId) {
        return projectRepository.findByUserId(userId);
    }

    // Create a project linked to the logged-in user
    @PostMapping("/user/{userId}")
    public Project createProject(@PathVariable Long userId, @RequestBody Project project) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        project.setUser(user);
        return projectRepository.save(project);
    }

    // Add a task to a specific project
    @PostMapping("/{projectId}/tasks")
    public Task addTaskToProject(@PathVariable Long projectId, @RequestBody Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);
        return taskRepository.save(task);
    }

    // Update a task's status
    @PutMapping("/tasks/{taskId}/status")
    public Task updateTaskStatus(@PathVariable Long taskId, @RequestBody String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return taskRepository.save(task);
    }
    
    // Delete an entire project (Hibernate will auto-delete all its tasks)
    @DeleteMapping("/{projectId}")
    public void deleteProject(@PathVariable Long projectId) {
        projectRepository.deleteById(projectId);
    }

    // Delete a specific task
    @DeleteMapping("/tasks/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
        taskRepository.deleteById(taskId);
    }
}