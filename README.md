<h1>React App GraphQL Server</h1>

<span>Corresponding Frontend: <a href="https://github.com/otboss/react-app">https://github.com/otboss/react-app</a></span>

<h3>Getting Started</h3>
<ol>
  <li>
    <span>Pull MySQL Docker image</span>
    <pre>docker pull mysql</pre>
  </li>
  <li>
    <span>Configure and start database</span>
    <pre>docker run --name mysql -p 127.0.0.1:3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql</pre>
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
    <span>For production, copy the 'dist' and 'node_modules' folders onto the production server and place enviroment variables in a file called '.env' in the root of the 'dist' folder. The server can then be started using the command: </span>
    <pre>npm run start</pre>
  </li>
</ol>