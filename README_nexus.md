## NEXUS

This project is continuation to the
[Buy-01](https://github.com/peter.vekony/buy-01),
[Mr-jenk](https://github.com/peter.vekony/buy-01) and
[Safezone](https://github.com/peter.vekony/buy-01) projects. The Purpose is to
add Sonatype Nexus Repository to the pipeline, to store the build artifacts and
external dependencies for the project.

---

#### SETUP & CONFIGURATION steps:

- Create a new Droplet on Digital Ocean
- Create users for teammembers, so there's no need to use root user
- Set up SSH keys for the team members and SSH into the machine
- Install docker on the droplet:<br>
  ```bash
  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  ```
- Download the
  [**Official Nexus Docker Image**](https://github.com/sonatype/docker-nexus3)<br>
  ```bash
  docker pull sonatype/nexus3
  ```
- Create volume for the container for data persistance:<br>
  ```bash
  docker volume create --name nexus-data
  ```
- Run the container in interactive mode to get access to the default admin
  password:<br>

  ```bash
  docker run -it -p 8081:8081 --name nexus -v nexus-data:/nexus-data sonatype/nexus3 /bin/bash
  ```

  <div align="center">
      <img src="./README_pics/admin_login.png" alt="admin login" width="auto" height="170"/>
  </div>

- Access the nexus dashboard and set up users with appropriate permissions:

  <div align="center">
      <img src="./README_pics/create_user.png" alt="create user" width="auto" height="250"/>
  </div>

- Create repositories for the build artifacts:

  <div align="center">
      <img src="./README_pics/create_repositories.png" alt="create repositories" width="auto" height="250"/>
  </div>

- Add Nexus repository URL to the **pom.xml** of the micro-services:

  <div align="center">
      <img src="./README_pics/pom_xml.png" alt="admin login" width="auto" height="180"/>
  </div>

- Go to **Jenkins** server and create `.m2/settings.xml` file for the jenkins
  user:

  <div align="center">
      <img src="./README_pics/settings_xml.png" alt="settings.xml" width="auto" height="500"/>
  </div>

- In **Jenkins** server, create `.npmrc` file for the jenkins user:

```bash
registry=http://161.35.24.93:8081/repository/frontend-group/
email=notarealperson@justabot.com
always-auth=true
//161.35.24.93:8081/repository/npm-dependencies/:_authToken="****************************"
//161.35.24.93:8081/repository/frontend-repo/:_auth="****************************"
//161.35.24.93:8081/repository/frontend-group/:_auth="****************************"
```

- Modify the `angular/package.json` file, add **registry** and set **private**
  to false:

  <div align="center">
      <img src="./README_pics/package_json.png" alt="package.json" width="auto" height="200"/>
  </div>

- Create new credentials for the **Jenkins** server to access the **Nexus**:

  <div align="center">
      <img src="./README_pics/jenk_crendentials.png" alt="jenk crendentials" width="auto" height="400"/>
  </div>

- Modify the [**Jenkinsfile**](Jenkinsfile)

- Run the pipeline and see the build artifacts in the Nexus repository.
