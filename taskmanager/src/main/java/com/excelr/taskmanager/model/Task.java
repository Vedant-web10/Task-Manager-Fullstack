package com.excelr.taskmanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String status;
    
    // Add this field right below private String status;
    private String priority = "Medium"; 

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private Project project;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    

    // Add these methods at the bottom with your other getters and setters
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}