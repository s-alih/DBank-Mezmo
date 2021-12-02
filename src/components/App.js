import { Tabs, Tab } from 'react-bootstrap'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import Web3 from 'web3';
import './App.css';
import dbank from '../dbank.png'


class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    await window.ethereum.enable();
    if(typeof window.ethereum !== "undefined"){
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      console.log(netId)
      
      if(typeof accounts[0] !== "undefined"){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account:accounts[0],web3:web3,balance:balance})
      }else{
        window.alert("Login with Metamask")
      }
      try{
        console.log(netId)
        const token = new web3.eth.Contract(Token.abi,Token.networks[netId].address)
        const tokenBalance = await token.methods.balanceOf(this.state.account).call()
        this.setState({token:token})
      }catch(e){
        console.log("Error",e)
        window.alert("Contract not deployed to the current network")
      }
      
    }else{
      window.alert("Please install Metamask")
    }
    

    //check if MetaMask exists

      //assign to values to variables: web3, netId, accounts

      //check if account is detected, then load balance&setStates, elsepush alert

      //in try block load contracts

    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    console.log(amount)
    //check if this.state.dbank is ok
    if(this.state.dbank !== "undefined"){
      try{
        await this.state.dbank.methods.deposit().send({value:amount.toString(),from:this.state.account })
      }catch(e){
        console.log("Error deposit")
      }
    }
   
      //in try block call dBank deposit();
  }

  async withdraw(e) {
    e.preventDefault()
    if(this.state.dbank !== "undefined"){
      try{
        await this.state.dbank.methods.withdraw().send({from:this.state.account})
      }catch(e){
        console.log("Error, withraw");
      }
    }
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }
  uploadFile =  async (event) =>  {
    event.preventDefault()
    
    console.log(this.uploadInput.files[0])
    const data = new FormData();
		data.append('file', this.uploadInput.files[0]);
	  var response =  await	fetch('http://localhost:8081/distribute', {
			method: 'POST',
			body: data
		})
    
    response.json().then(body => {
      console.log(body)
      this.setState({accounts:body.accounts,distAmount:body.tokenDistribute})
      this.setState({message:"Tokens are sending to accounts"})
      body.accounts.forEach(element => {
        console.log(element)
        this.state.token.transfer(element, this.state.distAmount, { from: this.state.account }, function (err, txHash) {
          if (err) console.error(err);
      
          if (txHash) {
            console.log('Transaction sent!');
            console.dir(txHash);
          }
          this.setState({message:"Tokens are send successfully"})
        });
      });
    });
   
    
}

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      accounts:[],
      distAmount:0,
      balance: 0,
      message:'',
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>Anuroop Token Distribution</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Anuroop Distribution Unit</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                {/*add Tab deposit*/}
                <Tab eventKey="deposit" title="Deposit">
                  <br /><br />
                  Distribute to accounts
                  <div className="App">
                    <h1>UpLoad Accounts File</h1>
                    <form onSubmit={this.uploadFile}>
                    <div>
                    <input
                    ref={ref => {
                      this.uploadInput = ref;
                    }}
                    type="file"
                    />
                    </div>
                    <br />
                    
                    <div>
						<button className="btn btn-success">Upload</button>
					</div>
                    <hr />
                    
                    </form>
                    <div>
                      {this.state.message}
                    </div>
                    </div>
                </Tab>
               
                <Tab eventKey="Withdraw" title="Withdraw">
                <br /><br />
                Do you want to withdraw + take interest
                <br /><br />
                <div>
                <button type='submit' className='btn btn-primary' onClick={(e)=>this.withdraw(e)}>WITHRAW</button>
                </div>
                {/*add Tab withdraw*/}
                    
                  
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;