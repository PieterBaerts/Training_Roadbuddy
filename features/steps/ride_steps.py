from behave import given, when, then
import requests

API_BASE = "http://localhost:8000/carpools"
ride_response = {}

@given("the FastAPI server is running")
def step_server_running(context):
    # Test of API bereikbaar is
    r = requests.get(f"{API_BASE}/rides/")
    assert r.status_code == 200

@when('I create a ride with driver "{driver}" from "{origin}" to "{destination}" at "{time}"')
def step_create_ride(context, driver, origin, destination, time):
    global ride_response
    response = requests.post(
        f"{API_BASE}/rides/",
        json={
            "driver_name": driver,
            "origin": origin,
            "destination": destination,
            "departure_time": time
        }
    )
    ride_response = response.json()
    assert response.status_code == 200

@then("the ride should be listed in the carpool rides")
def step_verify_ride(context):
    rides = requests.get(f"{API_BASE}/rides/").json()
    assert any(ride["id"] == ride_response["id"] for ride in rides)
