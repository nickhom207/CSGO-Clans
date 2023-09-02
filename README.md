# CSGO-Clans
## Setup Guide
1. Clone the CSGO-Clans Package
2. Open the root directory of the CSGO-Clans Package
3. In the root directory, open a terminal and run the command: npm install
4. In the same directory, also run the command: npm run setup
5. When prompted, type in your postgres password. This will setup the database.
6. Open the env.json file in the root directory
7. Change the password value to your postgres password
8. Change the api_key value to the steam api_key 
9. From the root directory run `psql --username <USERNAME> -f setup.sql` replace <USERNAME> with your postgres username to set up the database
10. Cd into the app directory and run the command: node server.js
------------------------------------------------------------------------------------------
In order to easily run without entering your steam information:
1. Vist this page: http://localhost:3000
2. In the textbox saying enter steamid, you can enter any of the following steam_ids for full functionality:
   - 76561198025039300
   - 76561198025039301
   - 76561198025039302
   - 76561198025039303
   - 76561198025039304
   - 76561198025039305
3. Click the submit button next to the textbox
