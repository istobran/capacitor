import '@stencil/router';
import { Component, Prop, Element, Listen, State } from '@stencil/core';
import { LocationSegments, RouterHistory } from '@stencil/router';
import SiteProviderConsumer, { SiteState } from '../../global/site-provider-consumer';

@Component({
  tag: 'capacitor-site',
  styleUrl: 'capacitor-site.scss'
})
export class App {
  history: RouterHistory = null;
  elements = [
    'site-header',
    'site-menu',
    'app-burger',
    '.root'
  ];

  @Element() el: HTMLElement;

  @Prop() isLandingPage = false;

  @State() isLeftSidebarIn: boolean;

  @Listen('window:resize')
  handleResize() {
    requestAnimationFrame(() => {
      if (window.innerWidth > 768 && this.isLeftSidebarIn) {
        this.isLeftSidebarIn = false;
        document.body.classList.remove('no-scroll');
        this.elements.forEach((el) => {
          this.el.querySelector(el).classList.remove('left-sidebar-in');
        });
      }
    });
  }

  @Listen('burgerClick')
  @Listen('leftSidebarClick')
  handleToggle() {
    if (window.innerWidth <= 768) this.toggleLeftSidebar();
  }

  setHistory = ({ history }: { history: RouterHistory }) => {
    if (!this.history) {
      this.history = history;
      this.history.listen((location: LocationSegments) => {
        (window as any).gtag('config', 'UA-44023830-42', { 'page_path': location.pathname + location.search });
      });
    }
  }

  componentDidLoad() {
    this.isLeftSidebarIn = false;
  }

  toggleLeftSidebar() {
    if (this.isLeftSidebarIn) {
      this.isLeftSidebarIn = false;
      document.body.classList.remove('no-scroll');
      this.elements.forEach((el) => {
        this.el.querySelector(el).classList.remove('left-sidebar-in');
        this.el.querySelector(el).classList.add('left-sidebar-out');
      });
    } else {
      this.isLeftSidebarIn = true;
      document.body.classList.add('no-scroll');
      this.elements.forEach((el) => {
        this.el.querySelector(el).classList.add('left-sidebar-in');
        this.el.querySelector(el).classList.remove('left-sidebar-out');
      });
    }
  }

  hostData() {
    return {
      class: {
        'landing-page': this.isLandingPage
      }
    }
  }

  render() {
    const siteState: SiteState = {
      isLeftSidebarIn: this.isLeftSidebarIn,
      toggleLeftSidebar: this.toggleLeftSidebar
    }
    const footerClass = this.isLandingPage ? 'footer-landing' : '';

    return (
      <SiteProviderConsumer.Provider state={siteState}>
        <div id="main-div">
          <site-header />
          <div class="app root">
            <stencil-router>
              <stencil-route style={{ display: 'none' }} routeRender={this.setHistory}/>
              <stencil-route-switch scrollTopOffset={0}>

                <stencil-route
                  url="/"
                  component="landing-page"
                  exact={true}
                />
                <stencil-route url="/docs/" exact={true} routeRender={() => (
                  <document-component page='/docs/'></document-component>
                )}/>

                <stencil-route url="/docs/:pageName*" routeRender={({ match }) => (
                  <document-component page={match.url}></document-component>
                )}/>
              </stencil-route-switch>
            </stencil-router>
          </div>
        </div>

        <footer class={footerClass}>
          <div class="container">
            <div id="open-source">
              <a href="http://ionicframework.com/" title="IonicFramework.com" rel="noopener">
                <div class="ionic-oss-logo"></div>
              </a>
              <p>Released under <span id="mit">MIT License</span> | Copyright @ {(new Date()).getFullYear()} Drifty Co.</p>
            </div>

            <div id="footer-icons">
              <iframe
                title="Github Star Count" 
                class="star-button"
                src="https://ghbtns.com/github-btn.html?user=ionic-team&repo=capacitor&type=star&count=true"
                frameBorder="0"
                scrolling="0"
                width="100px"
                height="20px"
              ></iframe>

              <a class="svg-button"
                id="capacitor-twitter"
                href="https://twitter.com/getcapacitor"
                target="_blank"
                rel="noopener"
                title="Open the Capacitor account on twitter"
                style={{fill: 'white'}}
                >
                <app-icon name="twitter"></app-icon>
              </a>
              <a class="svg-button" id="cap-forum" href="https://getcapacitor.herokuapp.com/" target="_blank" rel="noopener"
                title="Join the Capacitor slack">
                <app-icon name="slack"></app-icon>
              </a>
            </div>
          </div>
        </footer>
      </SiteProviderConsumer.Provider>
    );
  }
}
