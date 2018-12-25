import { h, Component, VNode, ComponentConstructor, FunctionalComponent, PreactHTMLAttributes, PreactDOMAttributes, ComponentChildren } from "preact";
import createStore, { IPreact, Connect, DispatchAction } from "ipreact";
import { History, Location } from "history";

export type ComponentProvider = ComponentConstructor<any, any> | FunctionalComponent<any>

export interface RouteProps {
    history: History
    children?: ComponentChildren
    node?: VNode
}
const { connect, getState, dispatch }: IPreact<RouteProps> = createStore()()

export interface RouterProps {
    path?: string
    exact?: boolean
    component: ComponentProvider | Promise<ComponentProvider>
}

export interface LinkProps extends JSX.HTMLAttributes {
    children?: ComponentChildren
    href: string
    onClick?: {
        (e: MouseEvent): void
    }
}


let RouterList: RouterProps[] = []

export const Router: FunctionalComponent<RouterProps> = (router: RouterProps) => {
    return h('a', {})
}

const getRouter = async (pathname = '/', history: History) => {
    const pathnames = pathname.match(/[^\/]+/g) || []
    for (let i = 0; i < RouterList.length; i++) {
        const { path = '', exact, component } = RouterList[i]
        let params = {}
        let paths = path.match(/[^\/]+/g) || []
        let match = true

        if (path === pathname) {
            const com = await Promise.resolve(component)
            return h(com, { params, history })
        }

        if (exact && pathnames.length !== paths.length) {
            continue;
        }

        for (let j = 0; j < paths.length; j++) {
            const p = paths[j];
            const value = pathnames[j]
            const m = p.match(/^:(\w+)$/)
            if (m && value) {
                params[m[1]] = value
            }
            else if (p === value) {

            } else {
                match = false
                break;
            }
        }

        if (match) {
            const com = await Promise.resolve(component)
            return h(com, {params, history})
        }
    }
}

const actions = {
    changePath: (pathname: string) => {
        const { history } = getState()
        getRouter(pathname, history).then(node => {
            dispatch(state => ({
                ...state,
                node
            }))
        })
    }
}

export const Route: ComponentConstructor<RouteProps, any> =  connect(() => {
    const { node } = getState()
    return {
        node
    }
})(class extends Component<RouteProps, any> {
    props: RouteProps
    rest: VNode[] = []
    constructor(props: RouteProps) {
        super(props)
        dispatch(state => ({
            ...state,
            history: props.history
        }))
        const { children = [] } = props
        let rest = [];
        [].concat(children).map((item: VNode) => {
            if (item.nodeName === Router) {
                const { path, exact, component } = item.attributes
                RouterList.push({ path, exact, component })
            } else {
                rest.push(item)
            }
        })
        this.rest = rest
    }

    componentDidMount () {
        const { history } = this.props
        history.listen((location, action) => {
            const { pathname } = location
            actions.changePath(pathname)
        })
        actions.changePath(last_href = history.location.pathname)
    }
    render () {
        const { rest = [] } = this
        const { node, history } = this.props
        return rest.length ? h('div', {history}, ...this.rest, node) : node
    }
})

let last_href: string
export const Link: FunctionalComponent<LinkProps> = connect(({href}) => {
    const { history } = getState()
    return {
        onClick (e: MouseEvent) {
            e.preventDefault()
            if (last_href != href) {
                last_href = href
                history.push(href)
            }
            // actions.changePath(href)
        }
    }
})(({ children, ...rest }: LinkProps) => h('a', rest, ...[].concat(children)))
