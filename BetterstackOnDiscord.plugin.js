/**
 * @name BetterstackOnDiscord
 * @author Skearch
 * @authorId 252767157585313802
 * @description Betterstack.com status on discord.
 * @version 1.0.2
 */

//replit url
const apiUrl = "";

//refresh update
const cooldown = 60000;

let additionalDom = document.createElement("div");
const xpathResult = document.evaluate(
  '//*[@id="app-mount"]/div[3]/div[1]/div[1]/div/div[2]/div/div/div/div/div[1]/section',
  document,
  null,
  XPathResult.FIRST_ORDERED_NODE_TYPE,
  null
);
let divs = [];

class MyPlugin {
  constructor(meta) { }

  start() {
    const root = xpathResult.singleNodeValue;
    if (root) {
      additionalDom = document.createElement("div");
      additionalDom.className = "panel_bd8c76 activityPanel__22355";
      additionalDom.innerHTML = `
				<div class="body__709f6">
					<div class="gameWrapper__5b041 clickableGameWrapper_a7dbaa">
						<div class="info_c28002">
						</div>
					</div>
				</div>
			`;

      root.insertBefore(additionalDom, root.firstChild);
    } else {
      BdApi.UI.showToast("Element not found using XPath.");
    }

    this.getUpdates();
    this.intervalId = setInterval(() => this.getUpdates(), cooldown);
  }


  stop() {
    clearInterval(this.intervalId);
    this.destroyDoms();
  }

  destroyDoms() {
    if (additionalDom && additionalDom.parentNode) {
      additionalDom.parentNode.removeChild(additionalDom);
    }
  }

  async getUpdates() {
    try {
      const response = await fetch(apiUrl, { method: "GET" });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      console.log("UPDATED BETTERSTACKONDISCORD");
      const data = await response.json();

      if (data && data.data) {
        divs.forEach(div => {
          div.innerHTML = '';
        });

        data.data.forEach(statusPage => {
          const subdomain = statusPage.attributes.subdomain.toUpperCase();
          const aggregateState = statusPage.attributes.aggregate_state;
          const logoUrl = statusPage.attributes.logo_url;

          const newDiv = document.createElement("div");
          newDiv.className = "text-sm-normal_e612c7 title__10613";
          newDiv.setAttribute("data-text-variant", "text-sm/normal");
          newDiv.style.color = "white";
          newDiv.style.display = "flex";
          newDiv.style.alignItems = "center";
          newDiv.style.marginTop = "7px";
          newDiv.style.marginBottom = "7px";

          const circleColor = aggregateState === "operational" ? "lightgreen" : "lightcoral";

          if (logoUrl) {
            const logoImg = document.createElement("img");
            logoImg.src = logoUrl;
            logoImg.alt = "Logo";
            logoImg.style.width = "20px";
            logoImg.style.marginRight = "10px";
            logoImg.style.height = "20px";
            logoImg.style.borderRadius = "40%";
            logoImg.style.verticalAlign = "middle";
            newDiv.appendChild(logoImg);
          }

          newDiv.innerHTML += ` ${subdomain} <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="4" fill="${circleColor}" aria-hidden="true" class="pointerEvents__33f6a"></circle></svg>`;

          additionalDom.appendChild(newDiv);
          divs.push(newDiv);
        });
      } else {
        BdApi.UI.showToast("Invalid or missing data in the JSON response.");
      }
    } catch (error) {
      BdApi.UI.showToast(error);
    }
  }
}

module.exports = MyPlugin;