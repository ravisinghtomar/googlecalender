import GoogleLogin from "react-google-login";
import { useState } from "react";
import ApiCalendar from "react-google-calendar-api";
import styles from "./style.module.css";

function App() {
  const [flag, setFlag] = useState(true);
  const [calendardata, setCalendardata] = useState(null);
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  const handleFailure = (result) => {
    alert(result);
  };

  const handleLogin = async (googleData) => {
    const res = await fetch("/api/google-login", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setLoginData(data);
    localStorage.setItem("loginData", JSON.stringify(data));
  };
  const handleLogout = () => {
    ApiCalendar.handleSignoutClick();
    localStorage.removeItem("loginData");
    setLoginData(null);
  };

  const listall = (e) => {
    if (ApiCalendar.sign) {
      ApiCalendar.listEvents({
        timeMin: new Date().toISOString(),
        timeMax: new Date(
          new Date().setUTCDate(new Date().getDate() + 10)
        ).toISOString(),
        showDeleted: true,
        maxResults: 10,
        orderBy: "updated",
      })
        .then(({ result }) => {
          setCalendardata(result.items);
          console.log(result);
        })
        .catch((e) => {
          console.log("Exception E : ", e);
        });
    }
  };

  const handleCalender = (flag) => {
    if (flag) {
      ApiCalendar.handleAuthClick()
        .then(() => {
          listall();
          flag = setFlag(false);
          console.log("sign in succesful!");
        })
        .catch((e) => {
          console.error(`sign in failed ${e}`);
        });
    }
  };

  const handleDate = (date) => {
    const offset = new Date(date).getTimezoneOffset();
    const yourDate = new Date(new Date(date).getTime() + offset * 60 * 1000);
    let modifiedDate =
      new Date(yourDate).toISOString().split("T")[0] +
      " " +
      new Date(yourDate).toLocaleTimeString();
    return modifiedDate;
  };

  return (
    <div className="App">
      <br />
      <h1>Calender Events Display app</h1>
      <br />
      <hr className={styles.hr} />
      <br />
      <br />
      <div>
        {loginData ? (
          <div>
            <div>
              <h2>Hi {loginData.name}</h2>
              <br />
              <br />
              <button
                onClick={handleLogout}
                className={styles.submitbuttnstyle}
              >
                Logout
              </button>
              <br />
              <br />
            </div>
            <div className={styles.inputtextfielddiv}>
              {flag || calendardata === null ? (
                <button onClick={handleCalender} className={styles.submitbuttnstyle}>Show Calender</button>
              ) : (
                <div>
                  {console.log("YOs", calendardata)}
                  <h3 style={{ textAlign: "center" }}> Events</h3>
                  <br />
                  <table className={styles.table_name}>
                    <tbody>
                      <tr>
                        <td className={styles.td}></td>
                        <td className={styles.td}>Creation</td>
                        <td className={styles.td}>Creator</td>
                        <td className={styles.td}>Organizer</td>
                        <td className={styles.td}>Starting Time</td>
                        <td className={styles.td}>Ending Time</td>
                        <td className={styles.td}>Status</td>
                        <td className={styles.td}>Summary</td>
                      </tr>
                      {calendardata.map((event, ind) => (
                        <tr key={ind}>
                          <td className={styles.td}><g className={styles.listbullets}>&diams;</g></td>
                          <td className={styles.td}>{handleDate(event.created)}</td>
                          <td className={styles.td}>{event.creator.email}</td>
                          <td className={styles.td}>{event.organizer.email}</td>
                          <td className={styles.td}>{handleDate(event.start.dateTime)}</td>
                          <td className={styles.td}>{handleDate(event.end.dateTime)}</td>
                          <td className={styles.td}>{event.status}</td>
                          <td className={styles.td}>{event.summary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <GoogleLogin
            clientId={
              "979170936973-aq2ri0q2h52dbgn2r8mu5gkur90ed0bk.apps.googleusercontent.com"
            }
            buttonText="Login using Google"
            onSuccess={handleLogin}
            onFailure={handleFailure}
            cookiePolicy={"single_host_origin"}
          ></GoogleLogin>
        )}
      </div>
    </div>
  );
}

export default App;
