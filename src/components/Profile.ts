import { html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MyElement } from 'types/MyElement';
import { gradients } from 'types/CSS';

@customElement('my-profile')
export class Profile extends MyElement {
  static profileBannerBackground = css`
    ${unsafeCSS(gradients[0])}
  `;
  static profileSocialIconBackground = css`
    ${unsafeCSS(gradients[gradients.length - 1])}
  `;

  static styles = css`
    :host {
      --profile-image-width: 128px;
      --profile-image-height: 128px;
      --profile-image-border-radius: 50%;
      --profile-image-background: #f2f2f2;
      --profile-image-box-shadow:
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.3) 0px 4px 12px 0px;
      --profile-banner-background: ${Profile.profileBannerBackground};
      --profile-social-icon-background: ${Profile.profileSocialIconBackground};
      --profile-gap: 8px;
      --profile-border-radius: 8px;
      --profile-border: 1px solid #666;

      display: block;
      position: sticky;
      top: 0;
      z-index: 10;
      animation: fadeOut 1.5s 2s forwards;
      background: var(--default-background-light);
    }
    @media (prefers-color-scheme: dark) {
      :host {
        background: var(--default-background-dark);
      }
    }
    .container {
      display: flex;
      margin: 0 auto;
      max-width: var(--container-desktop-width);
    }
    .profile-container {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: var(--profile-gap);
      width: 100%;
      border-radius: var(--profile-border-radius);
      border: var(--profile-border);
    }
    .profile-banner {
      width: 100%;
      aspect-ratio: 21 / 4;
      background: var(--profile-banner-background);
      border-top-left-radius: var(--profile-border-radius);
      border-top-right-radius: var(--profile-border-radius);
      border-bottom: var(--profile-border);
    }
    @media (max-width: 1024px) {
      .profile-banner {
        aspect-ratio: 21 / 6;
      }
    }
    .profile-overview {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 5rem;
      padding: 1rem;
    }
    @media (max-width: 1024px) {
      .profile-overview {
        flex-direction: column;
        gap: 1rem;
      }
    }
    .profile-card,
    .profile-social {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--profile-gap) 0;
      padding-top: calc(0.4 * var(--profile-image-height));
    }
    .profile-card {
      padding-top: calc(0.5 * var(--profile-image-height));
    }
    @media (max-width: 1024px) {
      .profile-social {
        padding-top: 0;
      }
    }
    .profile-social a {
      display: flex;
      align-items: center;
      gap: 0 0.5rem;
      color: inherit;
      text-decoration: none;
      font-weight: bold;
    }
    .profile-fullname {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .profile-image {
      position: absolute;
      top: calc(-0.75 * var(--profile-image-height));
      width: var(--profile-image-width);
      height: var(--profile-image-height);
      border-radius: var(--profile-image-border-radius);
      overflow: hidden;
      background: var(--profile-image-background);
      box-shadow: var(--profile-image-box-shadow);
    }
    .profile-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2em;
      height: 2em;
    }
    .profile-social-icon {
      margin: 0 0.25rem;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: var(--profile-social-icon-background);
      border: 2px solid #666;
      opacity: 0.5;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;

  private renderProfileImage(): ReturnType<typeof html> {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        viewBox="0 0 128 128"
      >
        <svg>
          <path fill="transparent" d="M0 0h128v128H0z" />
          <path
            d="M88.41 84.67a32 32 0 10-48.82 0 66.13 66.13 0 0148.82 0z"
            fill="#788fa5"
          />
          <path
            d="M88.41 84.67a32 32 0 01-48.82 0A66.79 66.79 0 000 128h128a66.79 66.79 0 00-39.59-43.33z"
            fill="#9db3c8"
          />
          <path
            d="M64 96a31.93 31.93 0 0024.41-11.33 66.13 66.13 0 00-48.82 0A31.93 31.93 0 0064 96z"
            fill="#56687a"
          />
        </svg>
      </svg>
    `;
  }

  private renderSocialIcon(): ReturnType<typeof html> {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      viewBox="0 0 512 512"
      fill="currentColor"
      stroke="currentColor"
    >
      <path
        d="M310.6 348.6c-5.1 13.1-18.3 26.3-35.6 30.2"
        fill="none"
        stroke="inherit"
        stroke-width="14"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
      ></path>
      <path
        d="M423.8 275.5c0-3.3 2.8-8 5.5-12.6 4.1-7 8.7-14.8 7-23.3-1.7-8.7-9.2-14.3-15.7-19.3-3.9-3-8.4-6.3-9.6-9.1-1.2-2.9-.5-8.3.3-13.5 1.1-8.1 2.4-17.2-2.5-24.4-4.9-7.3-13.8-9.6-21.7-11.6-4.8-1.3-10.3-2.7-12.5-4.9-2.2-2.2-3.6-7.7-4.9-12.5-2.1-7.9-4.4-16.9-11.7-21.7-7.2-4.8-16.3-3.6-24.4-2.5-5.2.7-10.6 1.5-13.5.3-2.8-1.2-6.2-5.6-9.1-9.6-5-6.6-10.6-14-19.3-15.7-8.4-1.7-16.3 3-23.3 7-4.6 2.7-9.4 5.5-12.6 5.5-3.3 0-8-2.8-12.6-5.5-7-4.1-14.8-8.7-23.3-7-8.7 1.7-14.3 9.2-19.3 15.7-3 3.9-6.3 8.4-9.1 9.6-2.9 1.2-8.3.5-13.5-.3-8.1-1.1-17.2-2.4-24.4 2.5-7.3 4.9-9.6 13.8-11.7 21.7-1.3 4.8-2.7 10.3-4.9 12.5-2.2 2.2-7.7 3.6-12.5 4.9-7.9 2.1-16.9 4.4-21.7 11.6-4.8 7.2-3.6 16.3-2.5 24.4.7 5.2 1.5 10.6.3 13.5-1.2 2.8-5.6 6.2-9.6 9.1-6.6 5-14 10.6-15.7 19.2-1.7 8.4 3 16.3 7 23.3 2.7 4.6 5.5 9.4 5.5 12.6 0 3.3-2.8 8-5.5 12.6-4.1 7-8.7 14.8-7 23.3 1.7 8.7 9.2 14.3 15.7 19.3 3.9 3 8.4 6.3 9.6 9.1 1.2 2.9.5 8.3-.3 13.5-1.1 8.1-2.4 17.2 2.5 24.4 4.9 7.3 13.8 9.6 21.7 11.6 4.8 1.3 10.3 2.7 12.5 4.9 2.2 2.2 3.6 7.5 4.6 11.5 1 4 5.1 6.4 9.2 5.4 4-1 6.4-5.1 5.4-9.1-1.9-7.3-3.8-13.6-8.5-18.3-5.1-5.1-12.3-6.9-19.3-8.8-5.3-1.4-11.3-2.9-13-5.5-1.7-2.5-.8-8.6-.1-14 1-7.2 2-14.6-.7-21.3-2.7-6.5-8.6-11-14.4-15.4-4.4-3.3-9.4-7.1-10-10.2-.6-2.8 2.5-8.1 5.3-12.8 3.5-6 7.6-12.9 7.6-20.2s-4-14.2-7.6-20.2c-2.7-4.6-5.8-9.9-5.3-12.8.6-3.1 5.6-6.9 10-10.2 5.7-4.3 11.7-8.8 14.4-15.4 2.8-6.7 1.7-14.1.7-21.3-.7-5.4-1.6-11.5.1-14 1.7-2.5 7.7-4.1 13-5.5 7-1.8 14.2-3.7 19.3-8.8 5.1-5.1 6.9-12.3 8.8-19.3 1.4-5.3 2.9-11.3 5.5-13 2.5-1.7 8.6-.8 14-.1 7.2 1 14.6 2 21.3-.7 6.5-2.7 11-8.6 15.4-14.4 3.3-4.4 7.1-9.4 10.2-10 2.8-.6 8.1 2.5 12.8 5.3 6 3.5 12.9 7.6 20.2 7.6s14.2-4 20.2-7.6c4.7-2.7 9.9-5.8 12.7-5.3 3.1.6 6.9 5.6 10.2 10 4.3 5.7 8.8 11.7 15.4 14.4 6.7 2.8 14.1 1.7 21.3.7 5.4-.7 11.5-1.6 14 .1 2.5 1.7 4.1 7.7 5.5 13 1.8 7 3.7 14.2 8.8 19.3 5.1 5.1 12.3 6.9 19.3 8.8 5.3 1.4 11.3 2.9 13 5.5 1.7 2.5.8 8.6.1 14-1 7.2-2 14.6.7 21.3 2.7 6.5 8.6 11 14.4 15.4 4.4 3.3 9.4 7.1 10 10.2.6 2.8-2.5 8.1-5.3 12.8-3.5 6-7.6 12.9-7.6 20.2 0 7.3 4 14.2 7.6 20.2 2.7 4.7 5.8 9.9 5.3 12.8-.6 3.1-5.6 6.9-10 10.2-5.7 4.3-11.7 8.8-14.4 15.4-2.8 6.7-1.7 14.1-.7 21.3.7 5.4 1.6 11.5-.1 14-1.7 2.5-7.7 4.1-13 5.5-7 1.8-14.2 3.7-19.3 8.8-4.7 4.7-6.6 11-8.5 18.3-1 4 1.4 8.1 5.4 9.2.6.2 1.3.2 1.9.2 3.3 0 6.4-2.2 7.3-5.6 1-3.9 2.4-9.3 4.6-11.5 2.2-2.2 7.7-3.6 12.5-4.9 7.9-2.1 16.9-4.4 21.7-11.7 4.8-7.2 3.6-16.3 2.5-24.4-.7-5.2-1.5-10.6-.3-13.5 1.2-2.8 5.6-6.1 9.6-9.1 6.6-5 14-10.6 15.7-19.2 1.7-8.4-3-16.3-7-23.3-2.8-4.5-5.6-9.3-5.6-12.6z"
      ></path>
      <path
        d="M366.6 318.3h5.6c15.2 0 27.5-12.4 27.5-27.5 0-15.2-12.4-27.5-27.5-27.5h-5c-3.9-.8-6.9-4.3-6.9-8.5v-24.4c0-9-4.5-17.3-12.1-22.2-7.1-4.7-15.6-5.4-23.2-2.1-1.3.6-2.8.9-4.6.9-4.8 0-6.9-1.9-10.9-5.9-4.3-4.3-10.3-10.3-21.5-10.3s-17.1 5.9-21.4 10.3c-4 4-6.1 5.9-10.8 5.9-4.7 0-6.9-1.9-10.8-5.9-4.3-4.3-10.3-10.3-21.4-10.3-11.2 0-17.1 5.9-21.4 10.3-4 4-6.1 5.9-10.8 5.9-1.8 0-3.3-.3-4.6-.9-7.6-3.3-16-2.6-23.1 2.1-7.5 4.9-12.1 13.2-12.1 22.2v8.8c0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5v-8.7c0-3.8 2-7.5 5.3-9.6 1.6-1.1 5-2.6 8.9-.9 3.3 1.4 6.7 2.1 10.6 2.1 11.2 0 17.1-5.9 21.4-10.3 4-4 6.1-5.9 10.8-5.9 4.7 0 6.9 1.9 10.8 5.9 4.3 4.3 10.3 10.3 21.4 10.3 11.2 0 17.1-5.9 21.4-10.3 4-4 6.1-5.9 10.8-5.9 4.8 0 6.9 1.9 10.9 5.9 4.3 4.3 10.3 10.3 21.5 10.3 3.9 0 7.3-.7 10.6-2.1 3.9-1.7 7.3-.2 8.9.9 3.3 2.1 5.3 5.8 5.3 9.6v24.4c0 3 .6 5.8 1.6 8.5h-23.4c-5.4-9.6-15.7-16-27.5-16-10.5 0-19.8 5.2-25.5 13.1-4-3.2-9.1-5-14.5-5s-10.5 1.9-14.5 5c-5.7-7.9-15-13.1-25.5-13.1-11.8 0-22 6.5-27.5 16h-48.7c-15.2 0-27.5 12.4-27.5 27.5 0 15.2 12.4 27.5 27.5 27.5h6.5c2.1 58.9 50.7 106.2 110.1 106.2s108-47.3 110.1-106.2h.2zm-70.5-56.1c9.1 0 16.5 7.4 16.5 16.5s-7.4 16.5-16.5 16.5-16.5-7.4-16.5-16.5 7.3-16.5 16.5-16.5zm-80.2 0c9.1 0 16.5 7.4 16.5 16.5s-7.4 16.5-16.5 16.5-16.5-7.4-16.5-16.5 7.4-16.5 16.5-16.5zm144.3 33.1c-4.1 0-7.5 3.4-7.5 7.5 0 3.1-.1 8.1-.2 11.6v1.4c-.1 1.5-.1 2.5-.1 2.5-2.1 51.2-44.4 92.2-96 92.2-51.7 0-94-41-96.1-92.1 0 0 0-.3-.1-.7v-.4c-.2-2.8-.9-10.2-.9-14.4 0-4.1-3.4-7.5-7.5-7.5s-7.5 3.4-7.5 7.5v.5h-4.5c-6.9 0-12.5-5.6-12.5-12.5s5.6-12.5 12.5-12.5h44.6v.5c0 17.4 14.2 31.5 31.5 31.5s31.5-14.2 31.5-31.5c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5c0 17.4 14.2 31.5 31.5 31.5s31.5-14.2 31.5-31.5v-.5h38.5c.9.1 1.9.2 2.9.2h4c.3 0 .5 0 .8-.1 6.2.8 11 6 11 12.4 0 6.9-5.6 12.5-12.5 12.5h-4.5v-.5c.1-4.3-3.3-7.6-7.4-7.6z"
      ></path>
    </svg>`;
  }

  private renderExternalLinkIcon(): ReturnType<typeof html> {
    return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4 28 28">
      <path
        fill="currentColor"
        d="M12,10v3a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V5A1,1,0,0,1,3,4H6V6H4v6h6V10h2Zm1-8H8V4h2.67L6,8.67,7.33,10,12,5.33V8h2V3A1,1,0,0,0,13,2Z"
      />
    </svg>`;
  }

  render(): ReturnType<typeof html> {
    return html`
      <div class="container" role="status" aria-live="polite">
        <div class="profile-container" aria-hidden="true">
          <div class="profile-banner"></div>
          <div class="profile-overview">
            <div class="profile-card">
              <div class="profile-image">${this.renderProfileImage()}</div>
              <div class="profile-fullname">Simon Gattner</div>
              <div class="profile-location">
                Düsseldorf, North Rhine-Westphalia, Germany
              </div>
              <div class="bio">Full-Stack and Frontend development</div>
            </div>
            <div class="profile-social">
              <div class="profile-linkedin">
                <a href="https://de.linkedin.com/in/simon-gattner"
                  ><span class="profile-icon">${this.renderSocialIcon()}</span>
                  Simon Gattner</a
                >
              </div>
              <div class="profile-github">
                <a href="https://github.com/exiguus/pl-banner"
                  ><span
                    class="profile-social-icon"
                    style="background: ${gradients[
                      Math.floor(Math.random() * gradients.length)
                    ]}"
                  ></span>
                  GitHub @exiguus/pl-banner
                  <span class="profile-icon"
                    >${this.renderExternalLinkIcon()}</span
                  ></a
                >
              </div>
              <div class="profile-website">
                <a href="https://www.gattner.name/"
                  ><span
                    class="profile-social-icon"
                    style="background: ${gradients[
                      Math.floor(Math.random() * gradients.length)
                    ]}"
                  ></span>
                  Company Website
                  <span class="profile-icon"
                    >${this.renderExternalLinkIcon()}</span
                  ></a
                >
              </div>
            </div>
          </div>
        </div>
        <p class="sr-only">Loading...</p>
      </div>
    `;
  }
}
