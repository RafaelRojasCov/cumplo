import React, { Component } from 'react';
import './App.css';
import Chart from '../components/Chart';

const formatDate = (dateStr, isStartDate) => {
  return (isStartDate)
    ? dateStr.replace(/(.{7}).{1}/,"$1/dias_i/").replace('-','/') 
    : dateStr.replace(/(.{7}).{1}/,"$1/dias_f/").replace('-','/');
}

const apikey = 'af2265fad0c1e4a4152c8f5b678270adce07700c';

class App extends Component {
  constructor(){
    super();
    this.state = { 
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Dolar',
            data: [],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      dateStartField: '2018-07-01',
      dateEndField: '2018-07-31',
      indicatorField: 'Dolar',
      avgValue: '',
      minValue: '',
      maxValue: '',
      options: { scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:false
                  }
              }],
              xAxes: [{
                type: 'time',
                position: 'bottom',
                time: {
                  displayFormats: {'day': 'DD MMM'},
                  tooltipFormat: 'DD/MM/YY',
                  unit: 'day',
                 }
              }]
          }
      }
    }
  }

  askData = (query, field) => {
    fetch(query)
      .then(response => response.json())
			.then((data) => {
				let chartLabels = [];
        let chartValues = [];
        
				if (field.toLowerCase() === 'dolar') {
					chartLabels = data.Dolares.map( (el) => el.Fecha);
					chartValues = data.Dolares.map( (el) => el.Valor.replace(',','.'));
				} else {
					chartLabels = data.UFs.map( (el) => el.Fecha);
					chartValues = data.UFs.map( (el) => el.Valor.replace('.','').replace(',','.'));
        }

				const dataCreated = {
                chartData: {
                  labels: chartLabels,
                  datasets: [
                    {
                      label: field,
                      data: chartValues,
                      backgroundColor: [
                        'rgba(255, 206, 86, 0.2)'
                      ],
                      borderColor: [
                        'rgba(255, 206, 86, 1)'
                      ],
                      borderWidth: 1
                    }
                  ]
                }
              };

          this.setState(dataCreated);

          const numValues = chartValues.map( num => parseFloat(num));
          this.setState({minValue: Math.min.apply(null, numValues)});
          this.setState({maxValue: Math.max.apply(null, numValues)});
          this.setState({avgValue: ((numValues.reduce((a,b) => a + b, 0))/ numValues.length).toFixed(2)});


      }).catch( err => console.log('Ha ocurrido un error con la API'));
  }

  componentDidMount(){
    let startDate = formatDate(this.state.dateStartField, true);
    let endDate = formatDate(this.state.dateEndField, false);
    let field = this.state.indicatorField;
    const query = `https://api.sbif.cl/api-sbifv3/recursos_api/${field.toLowerCase()}/periodo/${startDate}/${endDate}?apikey=${apikey}&formato=json`;
    this.askData(query, field);
  }

  handleOptions = (e) => {
    let startDate = formatDate(this.state.dateStartField, true);
    let endDate = formatDate(this.state.dateEndField, false);
    let field = this.state.indicatorField;
    
    if (e.target.id === 'firstDate'){
      this.setState({ dateStartField: e.target.value });
      startDate = formatDate(e.target.value, true);
    } else if (e.target.id === 'lastDate'){
      this.setState({ dateEndField: e.target.value });
      endDate = formatDate(e.target.value, false);
    } else if (e.target.id === 'indicator'){
      this.setState({ indicatorField: e.target.value });
      field = e.target.value;
    }

    const query = `https://api.sbif.cl/api-sbifv3/recursos_api/${field.toLowerCase()}/periodo/${startDate}/${endDate}?apikey=${apikey}&formato=json`;
    this.askData(query, field);
  }

  render(){
    return(
      <div className="App">
        <div className="container">
          <h1>Indicadores del dolar y UF</h1>
          <p>Por favor seleccione una fecha de inicio, fecha de término  y el indicador para actualizar el gráfico</p>
          <section>
            <form className="form">
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="firstDate">Fecha Inicio</label>
                    <input 
                      type="date" className="form-control" 
                      id="firstDate"  
                      onChange={this.handleOptions} value={this.state.dateStartField}/>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="lastDate">Fecha Término</label>
                    <input 
                      type="date" className="form-control" 
                      id="lastDate"  
                      onChange={this.handleOptions} value={this.state.dateEndField}/>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="indicator">Indicador</label>
                    <select 
                      id="indicator" className="form-control" 
                      onChange={this.handleOptions} defaultValue={this.state.indicatorField} >
                      <option>UF</option>
                      <option>Dolar</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </section>
          <section>
            <Chart
              chartData={this.state.chartData}
              options={this.state.options}
            />
          </section>
          <section>
            <div className="row">
              <div className="col">
                <span>Valor promedio: {this.state.avgValue} </span>
              </div>
              <div className="col">
                <span>Valor minimo: {this.state.minValue} </span>
              </div>
              <div className="col">
                <span>Valor máximo: {this.state.maxValue} </span>
              </div>
            </div>
          </section>
        </div>

      </div>
    );
  }
}

export default App;
