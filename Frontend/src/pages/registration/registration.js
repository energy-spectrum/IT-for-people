import './registration.css';


export default function Registration() {

    return (
      <div className="d-flex m-auto directionColumn" style={{width: '300px', height: 'auto', padding: '20px 10px', backgroundColor: 'silver'}}>
        <h6 style={{margin: '0px auto 20px auto', cursor: 'default'}}>Регистрация</h6>
        <form className="d-flex w-100 directionColumn">
          
          <div className="d-flex w-100">
            <p>ФИО:</p>
            <input className="w-100" required type="text" placeholder="Иванов Иван Иванович" />
          </div>

          <div className="d-flex w-100 mb-10 mt-10">
            <p>Email:</p>
            <input className="w-100" required type="email" placeholder="ivan@mail.ru" />
          </div>

          <div className="d-flex w-100 mb-10">
            <p>Отдел:</p>
            <input className="w-100" required type="text" placeholder="frontend" />
          </div>

          <div className="d-flex w-100 mb-10">
            <p>Password:</p>
            <input className="w-100" required type="password" placeholder="8-12 *" />
          </div>
          
          <input type="submit" style={{borderRadius: '15px', margin: '0px 30px', backgroundColor: 'lightblue', border: '1px solid black', cursor: 'pointer', padding: '5px 79px'}} value="Регистрация" />
        </form>
      </div>
    );
  }
  