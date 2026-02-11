import React from "react";
import RouteMap from "./RouteMap";

class CarpoolForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      driver_name: "",
      origin: "",
      destination: "",
      departure_time: "",
      passenger_limit: "", // Added passenger_limit to state
      form_errors: [],
      filterOrigin: "",
      filterDestination: "",
      rides: [],
      passenger_inputs: {}, // ride_id -> value
    };
  }

  componentDidMount() {
    this.fetchRides();
    const userData = localStorage.getItem("user");
    if (userData) {
      this.setState({ user: JSON.parse(userData) });
    }
  }

  handleLogout = () => {
    localStorage.removeItem("user");
    this.setState({ user: null });
  };

  formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleString();
    } catch (e) {
      return isoString;
    }
  };

  fetchRides = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/carpools/rides/");
      const data = await response.json();
      this.setState({ rides: data });
    } catch (error) {
      console.error("Fout bij ophalen ritten:", error);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFilterChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  clearFilters = () => {
    this.setState({
      filterOrigin: "",
      filterDestination: "",
    });
  };

  handlePassengerInputChange = (rideId, value) => {
    this.setState((prevState) => ({
      passenger_inputs: {
        ...prevState.passenger_inputs,
        [rideId]: value,
      },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { driver_name, origin, destination, departure_time, passenger_limit } = this.state;

    // client-side validations
    const errors = [];
    if (!driver_name || !driver_name.trim()) errors.push('Driver name is required');
    if (!origin || !origin.trim()) errors.push('Origin is required');
    if (!destination || !destination.trim()) errors.push('Destination is required');
    if (!departure_time) {
      errors.push('Departure time is required');
    } else {
      const dt = new Date(departure_time);
      if (isNaN(dt.getTime())) errors.push('Departure time is invalid');
      else if (dt <= new Date()) errors.push('Departure time must be in the future');
    }
    const pl = parseInt(passenger_limit);
    if (isNaN(pl) || pl < 1) errors.push('Passenger limit must be a number >= 1');

    if (errors.length) {
      this.setState({ form_errors: errors });
      return;
    }

    const newRide = {
      driver_name,
      origin,
      destination,
      // send ISO string to backend
      departure_time: new Date(departure_time).toISOString(),
      passenger_limit: pl,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/carpools/rides/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRide),
      });

      if (res.ok) {
        this.setState({
          driver_name: "",
          origin: "",
          destination: "",
          departure_time: "",
          passenger_limit: "",
          form_errors: [],
        });
        await this.fetchRides();
      } else {
        // try to parse error detail
        let detail = 'Failed to create ride';
        try {
          const body = await res.json();
          if (body.detail) detail = body.detail;
        } catch (err) {
          // ignore parse errors
        }
        this.setState({ form_errors: [detail] });
      }
    } catch (error) {
      console.error("Fout bij toevoegen rit:", error);
    }
  };

  handleAddPassenger = async (rideId) => {
    const passenger_name = this.state.passenger_inputs[rideId];
    if (!passenger_name) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/carpools/rides/${rideId}/passengers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passenger_name }),
        }
      );

      if (res.ok) {
        this.setState((prevState) => ({
          passenger_inputs: {
            ...prevState.passenger_inputs,
            [rideId]: "",
          },
        }));
        await this.fetchRides();
      } else {
        console.error("Toevoegen passagier mislukt.");
      }
    } catch (error) {
      console.error("Fout bij toevoegen passagier:", error);
    }
  };

  handleDeleteRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/carpools/rides/${rideId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await this.fetchRides();
      } else {
        console.error("Failed to delete ride");
      }
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };

  render() {
    const { filterOrigin, filterDestination } = this.state;
    const filteredRides = this.state.rides.filter(ride => {
      return (
        ride.origin.toLowerCase().includes(filterOrigin.toLowerCase()) &&
        ride.destination.toLowerCase().includes(filterDestination.toLowerCase())
      );
    });

    return (
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '16px' }}>
        {this.state.user && (
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Welcome, {this.state.user.username} ({this.state.user.role})</span>
            <button onClick={this.handleLogout}>Log Out</button>
          </div>
        )}
        <h1>Carpool Planner</h1>
        {this.state.form_errors && this.state.form_errors.length > 0 && (
          <div style={{ color: 'red', marginBottom: '12px' }}>
            <ul>
              {this.state.form_errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={this.handleSubmit}>
          <input
            name="driver_name"
            placeholder="Driver name"
            value={this.state.driver_name}
            onChange={this.handleChange}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}
          />
          <input
            name="origin"
            placeholder="Origin"
            value={this.state.origin}
            onChange={this.handleChange}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}
          />
          <input
            name="destination"
            placeholder="Destination"
            value={this.state.destination}
            onChange={this.handleChange}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}
          />
          <input
            name="departure_time"
            type="datetime-local"
            value={this.state.departure_time}
            onChange={this.handleChange}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}
          />
          <input
            name="passenger_limit"
            type="number"
            placeholder="Number of Passengers"
            value={this.state.passenger_limit}
            onChange={this.handleChange}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}
          />
          <button type="submit">Create Ride</button>
        </form>

        <h2>Ride List</h2>
        <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              name="filterOrigin"
              placeholder="Filter by origin"
              value={this.state.filterOrigin}
              onChange={this.handleFilterChange}
              style={{ padding: '6px', flex: 1, boxSizing: 'border-box' }}
            />
            <input
              name="filterDestination"
              placeholder="Filter by destination"
              value={this.state.filterDestination}
              onChange={this.handleFilterChange}
              style={{ padding: '6px', flex: 1, boxSizing: 'border-box' }}
            />
          </div>
          <button onClick={this.clearFilters} style={{ alignSelf: 'flex-start' }}>Clear Filters</button>
        </div>
        <ul className="ride-list">
          {filteredRides.map((ride) => (
            <li key={ride.id} style={{ marginBottom: "32px" }}>
              <div
                className="ride-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{ride.driver_name}</h3>
                  <div style={{ fontSize: "0.95rem", color: "#ddd" }}>
                    {ride.origin} {"\u2192"} {ride.destination}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#bbb" }}>
                    {this.formatDate(ride.departure_time)}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", color: "#bbb", marginBottom: "6px" }}>Passengers</div>
                  <div
                    style={{
                      background: "#333",
                      color: "#fff",
                      padding: "6px 10px",
                      borderRadius: "16px",
                      fontSize: "0.9rem",
                      minWidth: "64px",
                    }}
                  >
                    {ride.passengers ? ride.passengers.length : 0}/{ride.passenger_limit}
                  </div>
                </div>
              </div>

              {this.state.user && this.state.user.role === 'admin' && (
                <div style={{ marginBottom: '8px' }}>
                  <button 
                    onClick={() => this.handleDeleteRide(ride.id)}
                    style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* 📍 Kaartweergave */}
              <RouteMap origin={ride.origin} destination={ride.destination} />

              {/* 👥 Passagierslijst */}
              

              {/* ➕ Passagier toevoegen */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
                <input
                  name="passenger_name"
                  placeholder="Passenger name"
                  value={this.state.passenger_inputs[ride.id] || ""}
                  onChange={(e) =>
                    this.handlePassengerInputChange(ride.id, e.target.value)
                  }
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => this.handleAddPassenger(ride.id)}
                  disabled={ride.passengers && ride.passengers.length >= ride.passenger_limit}
                >
                  Add Passenger
                </button>
              </div>
              
              {ride.passengers && ride.passengers.length >= ride.passenger_limit && (
                <p style={{ color: "red", marginBottom: "10px" }}>This ride is full.</p> // Moved and added spacing
              )}

              {ride.passengers && ride.passengers.length > 0 && (
                <ul>
                  {ride.passengers.map((p, index) => (
                    <li key={index}>{p}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default CarpoolForm;
