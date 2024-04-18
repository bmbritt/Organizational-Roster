Technical Specification Documentation


Story 1: Add/Delete Self to Public Organization 

	Models:
We created both a frontend and backend model for the Member class. The member class has five fields: id: int | none, name: str, profile_id: int, affiliation: str, and organization_id: int. 
A member’s “id” is unique and differs amongst each organization they belong to. 
A member’s “name” is taken from their profile. 
A member’s “profile_id” refers to their PID. 
A member’s “affiliation” refers to their role in the organization (i.e., President, Vice President, Organization Officer, etc.)
A member’s “organization_id” refers to the unique id of the organization they belong to.

	API Routes:
GET  ("/organization/{slug}"): This API route gets all the members one the specific organization based of the slug provided 
POST ("/organization/{slug}"): This API routes creates a new member in the specific organization
DELETE ("/organization/{slug}"): This API route deletes a member in a specific organization


	Database/ Entity-Level Representations Decisions: 
Member Entity: 
The Member Entity’s table name is “member”
Member has six fields: id: Mapped[int], name: Mapped[str], affiliation: Mapped[str], profile_id: Mapped[int], organization_id: Mapped[int], organization: Mapped[“OrganizationEntity”].
The Member Entity has two methods: from_model and to_model.
From_model converts the Member pydantic model into a Member Entity.
To_model converts a Member Entity into a Member pydantic model.
	
	Design Choice and Justification:
Technical: 
We chose to implement a Member Entity instead of working with the preexisting User Entity because we wanted each member to have an organization ID associated with them (to uniquely identity each organization they belong to), as well as affiliations to define their role within the organization (i.e., President, Vice President, Organization Officer, etc.). 
User Experience: 
We chose to publicly display an organization’s affiliations on their roster instead of keeping the information private because it allows potential members to reach out to the organization’s leaders with questions/concerns. 

	Developer Guide:
To get started on our feature, a developer needs to familiarize themselves with both the frontend and backend Member model and service, as well as the Member API and Member Entity.
The member model has five fields: id: int | none, name: str, profile_id: int, affiliation: str, and organization_id: int.
The frontend Member service is located within the Organization service. It provides methods to get, add, and remove members from a public organization in the frontend.
The backend Member service provides the methods to add and remove members from a public organization in the database.
The Member API allows you to request, post, and delete Member data.
The Member Entity contains the “member” table which stores all of the members’ information within the database (i.e., id, name, affiliation, profile id, organization id, and associated organization)


Story 2: Request to Join a Private Organization

Models:
We created both a frontend and backend model for the Request class. The request class has seven fields: id: int | none, name: str, organization_id: int, strength: str, reasoning: str, major: str, and profile_id: int.
A request’s “id” is unique and differs amongst each organization it belongs to. 
A request’s “name” is taken from the user’s name submission.
A request’s “organization_id” refers to the unique id of the organization the request belongs to. 
A request’s “strength” refers to the user’s inputted strengths (on the join request form).
A request’s “reasoning” refers to the user’s inputted reason for wanting to join the organization (on the join request form).
A request’s “major” refers to the user’s inputted major (on the join request form).
A request’s “profile_id” refers to the user’s PID. 

	API Routes:
POST("/organization/{slug}"): This API route creates a new Request in the database.

	Database/ Entity-Level Representations Decisions:
Request Entity:
The Request Entity’s table name is “request”
Request has eight fields: id: Mapped[int], name: Mapped[str], strength: Mapped[str], reasoning: Mapped[str], major: Mapped[str], profile_id: Mapped[int], organization_id: Mapped[int], organization: Mapped[“OrganizationEntity”]
The Request Entity has two methods: from_model and to_model.
From_model converts the Request pydantic model into a Request Entity.
To_model converts a Request Entity into a Request pydantic model.
	
	Design Choice and Justification:
Technical: 
On the request form, we chose to include questions pertaining to the user’s strengths, as well as their motivation for requesting to join the organization. We opted for this over solely close-ended questions because it allows the organization’s leaders to determine if the user is a good fit for the organization, and if they’re not, the leader’s can explain why they chose to deny the user’s request and can recommend organizations that might be a better fit for them.
User Experience: 
After a user has submitted a request to join an organization, we decided to make the “Request to Join Organization button” turn red and display the text “Your Request to Join is Pending.” We opted for this over keeping the previous button because it allows the user to see the status of their request, as well as prevents them from submitting the form again (while approval is pending).
	
	Developer Guide:
To get started on our feature, a developer needs to familiarize themselves with both the frontend and backend Request model and service, as well as the Request API and Request Entity. 
The request model has seven fields: id: int | none, name: str, organization_id: int, strength: str, reasoning: str, major: str, and profile_id: int.
The frontend and backend Request service(s) provide a method to add requests and store them in the database.
The Request API allows you to post the Request data.
The Request Entity contains the “request” table which stores all of the requests information within the database (i.e., id, name, strength, reasoning, major, profile id, organization id, and organization)
