<h1>React App GraphQL Server</h1>

<span>Corresponding Frontend: <a href="https://github.com/otboss/react-app">https://github.com/otboss/react-app</a></span>

<h3>Getting Started</h3>
<ol>
  <li>
    <span>Pull MySQL Docker image</span>
    <pre>docker pull mysql</pre>
  </li>
  <li>
    <span>Configure and start MySQL server</span>
    <pre>docker run --name mysql -p 127.0.0.1:3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql</pre>
  </li>
  <li>
    <span>Create Database.</span>
    <pre>docker exec mysql mysql --user="root" --password="root" --execute="CREATE DATABASE hardware_store"</pre>
    <p>WARNING: Do not use this method in production!</p>
  </li>
  <li>
    <span>Install dependencies</span>
    <pre>npm install</pre>
  </li>
  <li>
    <span>Start server (development)</span>
    <pre>npm run start-dev</pre>
  </li>
  <li>
    <span>For production, copy the 'dist' and 'node_modules' folders onto the production server and place enviroment variables in a file called '.env' in the containing folder's root. The server can then be started using the command: </span>
    <pre>npm run start</pre>
  </li>
</ol>

<h3>GraphQL Documentation</h3>
<span>Run the following commend below to serve the GraphQL documentation files: </span>
<pre>http-server ./schema_doc/</pre>
<span>If the <b>http-server</b> command is not found it may be installed with: </span>
<pre>npm install -g http-server</pre>