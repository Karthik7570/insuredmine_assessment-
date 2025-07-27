Please read the instructions to set up the project

For MongoDatabase configuration
We use a Docker image that runs on port 27017

The curl command 

to upload the CSV file

curl --location 'http://localhost:3000/uploads?file=null' \
--form 'file=@"/C:/Users/windev/Downloads/data-sheet - Node js Assesment (2) (1) (1).csv"'

Find the policies by username
curl --location 'http://localhost:3000/api/policies/by-username?username=Lura%20Lucca'

aggregate
curl --location 'http://localhost:3000/aggregate'


scheduler
curl --location 'http://localhost:3000/scheduler/schedule-message' \
--header 'Content-Type: application/json' \
--data '{
    "message": "Reminder: Standup meeting",
    "day": "2025-07-27",
    "time": "15:15:00"
}'

