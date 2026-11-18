import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // --- AUTHENTICATION STATE WITH LOCAL STORAGE ---
  const [loggedInUser, setLoggedInUser] = useState(() => {
    // Check if user data exists in the browser memory on load
    const savedUser = localStorage.getItem('taskManagerUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!loggedInUser);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // --- KANBAN DASHBOARD STATE ---
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Fetch projects only if logged in, using the specific User ID
  useEffect(() => {
    if (isLoggedIn && loggedInUser) {
      fetchProjects();
    }
  }, [isLoggedIn, loggedInUser]);

  // --- AUTHENTICATION LOGIC ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, {
        email: email,
        password: password
      });

      if (isLoginMode) {
        const userData = response.data; // Spring Boot now returns the User object
        localStorage.setItem('taskManagerUser', JSON.stringify(userData)); // Save to browser
        setLoggedInUser(userData);
        setIsLoggedIn(true);
      } else {
        alert("Account created successfully! You can now log in.");
        setIsLoginMode(true);
        setPassword('');
      }
    } catch (error) {
      setAuthError(error.response?.data || "Authentication failed. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('taskManagerUser'); // Clear browser memory
    setLoggedInUser(null);
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setProjects([]); // Clear the board
  };

  // --- DASHBOARD LOGIC ---
  const fetchProjects = async () => {
    try {
      // Fetch only projects matching the logged-in user's ID
      const response = await axios.get(`http://localhost:8080/api/projects/user/${loggedInUser.id}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    
    // Send the POST request to the new user-specific endpoint
    await axios.post(`http://localhost:8080/api/projects/user/${loggedInUser.id}`, { 
      name: newProjectName, 
      description: newProjectDesc 
    });
    
    setNewProjectName('');
    setNewProjectDesc('');
    fetchProjects();
  };

  const handleAddTask = async (projectId, e) => {
    e.preventDefault();
    const title = e.target.elements.taskTitle.value;
    const priority = e.target.elements.taskPriority.value;
    if (!title) return;
    
    await axios.post(`http://localhost:8080/api/projects/${projectId}/tasks`, { title: title, status: 'TODO', priority: priority });
    e.target.reset();
    fetchProjects();
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    await axios.put(`http://localhost:8080/api/projects/tasks/${taskId}/status`, newStatus, { headers: { 'Content-Type': 'text/plain' } });
    fetchProjects();
  };

  const handleDeleteProject = async (projectId) => {
    if(window.confirm("Are you sure? This will delete the project and all its tasks.")) {
      await axios.delete(`http://localhost:8080/api/projects/${projectId}`);
      fetchProjects();
    }
  };

  const handleDeleteTask = async (taskId) => {
    await axios.delete(`http://localhost:8080/api/projects/tasks/${taskId}`);
    fetchProjects();
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'High') return 'badge bg-danger';
    if (priority === 'Medium') return 'badge bg-warning text-dark';
    return 'badge bg-info text-dark';
  };

  // --- RENDER LOGIN/SIGNUP SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow-lg border-0 p-5" style={{ width: '400px', borderRadius: '15px' }}>
          <h2 className="text-center text-primary mb-4 fw-bold">
            {isLoginMode ? 'Task Manager Login' : 'Create Account'}
          </h2>
          
          {authError && <div className="alert alert-danger text-center py-2">{authError}</div>}
          
          <form onSubmit={handleAuth}>
            <div className="mb-3">
              <input type="email" className="form-control" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">
              {isLoginMode ? 'Log In' : 'Sign Up'}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <button className="btn btn-link text-decoration-none text-muted" onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }}>
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER KANBAN DASHBOARD ---
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary fw-bold mb-0">Task Management Dashboard</h1>
        {/* Updated Logout Button */}
        <button onClick={handleLogout} className="btn btn-outline-danger shadow-sm fw-bold">Logout ({loggedInUser.email})</button>
      </div>
      
      <div className="card shadow-sm mb-5 border-0 bg-light">
        <div className="card-body">
          <h5 className="card-title mb-3 text-secondary">Create New Project</h5>
          <form onSubmit={handleCreateProject} className="d-flex gap-3">
            <input type="text" className="form-control border-0 shadow-sm" placeholder="Project Name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
            <input type="text" className="form-control border-0 shadow-sm" placeholder="Description" value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} />
            <button type="submit" className="btn btn-primary px-4 shadow-sm">Create</button>
          </form>
        </div>
      </div>

      {projects.map(project => (
        <div key={project.id} className="card shadow mb-5 border-0">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">{project.name} <span className="fs-6 fw-light ms-2 text-white-50">{project.description}</span></h5>
            <button onClick={() => handleDeleteProject(project.id)} className="btn btn-outline-danger btn-sm border-0">Delete Project</button>
          </div>
          
          <div className="card-body bg-light">
            <form onSubmit={(e) => handleAddTask(project.id, e)} className="mb-4 d-flex gap-2">
              <input type="text" name="taskTitle" className="form-control w-25 shadow-sm border-0" placeholder="New Task Title" />
              <select name="taskPriority" className="form-select w-auto shadow-sm border-0">
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <button type="submit" className="btn btn-success btn-sm px-3 shadow-sm">+ Add Task</button>
            </form>

            <div className="row">
              {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
                <div key={status} className="col-md-4">
                  <div className="p-3 bg-white border rounded shadow-sm h-100">
                    <h6 className="text-center border-bottom pb-2 mb-3 fw-bold text-secondary">
                      {status.replace('_', ' ')}
                    </h6>
                    {project.tasks?.filter(task => task.status === status).map(task => (
                      <div key={task.id} className="card mb-3 border-0 shadow-sm bg-light">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="fw-medium">{task.title}</span>
                            <span className={getPriorityBadge(task.priority)}>{task.priority}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <button onClick={() => handleDeleteTask(task.id)} className="btn btn-link text-danger p-0 text-decoration-none fs-6">Delete</button>
                            <div className="dropdown">
                              <button className="btn btn-white btn-sm border shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">Move</button>
                              <ul className="dropdown-menu shadow">
                                <li><button className="dropdown-item" onClick={() => updateTaskStatus(task.id, 'TODO')}>To Do</button></li>
                                <li><button className="dropdown-item" onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}>In Progress</button></li>
                                <li><button className="dropdown-item" onClick={() => updateTaskStatus(task.id, 'DONE')}>Done</button></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;