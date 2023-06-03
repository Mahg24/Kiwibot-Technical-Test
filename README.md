# Kiwibot technical test

To simulate the behavior of the robot, the "Create Report" endpoint expects a response from the robot on the socket, following the configuration provided in the example socket called "Heartbeat response".

The purpose of this configuration is to ensure a successful communication between the client and the robot. When the client sends a request to create a report, it establishes a connection with the robot through the socket. The "Heartbeat response" example outlines the expected format and content of the response that the robot should provide.

By adhering to the "Heartbeat response" configuration, the robot can convey vital information or acknowledge the receipt of the request. This helps maintain the integrity of the communication and allows for proper synchronization between the client and the robot.

Therefore, when testing the "Create Report" endpoint, it is important to ensure that the robot's response on the socket aligns with the specified format and content as demonstrated in the "Heartbeat response" example.

Please let me know if you need any further clarification or assistance
