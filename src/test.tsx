import { h, Component, render } from 'preact'
import { Router, Route, Link } from './ipreact-router'
import { createHashHistory } from 'history'

interface Com2Props {params: {title: string}}

class App extends Component {
    com1 = () => <div>com1</div>
    com2 = ({params}: Com2Props) => <div>com2: {params.title}</div>
    com3 = () => <div>com3</div>
    com404 = () => <h2>404</h2>
    
    history = createHashHistory()
    state = {pathname: this.history.location.pathname}
    componentDidMount () {
        const t = this;
        t.history.listen((location) => {
            t.setState({
                pathname: location.pathname
            })
        })        
    }
    render () {
        const { pathname } = this.state
        return <div>
            <p>
                <Link className={pathname === '/com1' ? 'current' : ''} href="/com1">com1</Link>
                <Link className={pathname === '/com2' ? 'current' : ''} href="/com2">com2</Link>
                <Link className={pathname === '/com2/heheda' ? 'current' : ''} href="/com2/heheda">com2/heheda</Link>
                <Link className={pathname === '/com3' ? 'current' : ''} href="/com3">com3</Link>
                <Link className={pathname === '/com3/sub' ? 'current' : ''} href="/com3/sub">com3/sub</Link>
            </p>
            <Route history={this.history}>
                <Router path="com1" exact component={this.com1}/>
                <Router path="com2/:title" component={this.com2}/>
                <Router path="com3" exact component={this.com3}/>
                <Router component={this.com404}/>
            </Route>
        </div>
    }
}

render(<App/>, document.getElementById('app'))