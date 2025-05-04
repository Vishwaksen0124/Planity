How to run:
1:Open 2 terminals
2:in first terminal
  run cd server,nodemon index.js
  the backend code runs here
3.in second terminal
  run cd client,npm run dev
  the frontend code for our project run here
4.Then open the localhost
5.For admin
  email:admin@gmail.com
  password:123456
6.For user
  email:user@gmail.com
  password:user@gmail.com
7.For team lead
  email:user2@gmail.com
  password:user2@gmail.com

## Running with Docker

You can also run the entire application using Docker:

1. Make sure Docker and Docker Compose are installed on your system
2. From the root directory, run:
   ```
   docker-compose up -d
   ```
3. This will start all services (frontend, backend, MongoDB, and Redis)
4. Access the application at http://localhost
5. To stop the application, run:
   ```
   docker-compose down
   ```

### Docker Commands

- Build and start all containers: `docker-compose up -d`
- View logs: `docker-compose logs -f`
- Stop all containers: `docker-compose down`
- Rebuild containers: `docker-compose up -d --build`
- View running containers: `docker ps`

### Troubleshooting Docker Issues

If you encounter issues with Docker:

1. **Build Errors**: If you see build errors, try rebuilding with:
   ```
   docker-compose up -d --build
   ```

2. **Container Logs**: Check container logs for errors:
   ```
   docker-compose logs -f [service-name]
   ```
   Example: `docker-compose logs -f frontend`

3. **Clean Up**: If you need to start fresh:
   ```
   docker-compose down -v
   docker-compose up -d
   ```

4. **Case Sensitivity**: The Docker setup includes fixes for case sensitivity issues in import paths.

About our project:
Our platform is designed to empower teams of all sizes to achieve their goals efficiently by organizing tasks, managing resources, and improving communication. Whether you're handling small projects or managing large-scale operations, our tool adapts to your needs, ensuring every task is on track and every milestone is celebrated.
In our project there are 3 types of users:user,team lead,admin
User can only be assigned tasks and he can add sub tasks to it.
Team lead can view the team members and provide tasks to users and delete the tasks.
Admin can do whatever user and team lead does ,along with these admin has option to add,delete,edit users and team leads.
Admin has a dashboard to analyse the team work and trashed tasks can be restored by admin.