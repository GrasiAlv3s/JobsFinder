const openMenu = () => {
  const avatarMenu = document.querySelector(
    '[data-testid="menu-avatar-desktop"]'
  );
  const avatarMenuButton = avatarMenu.querySelector("button");
  avatarMenuButton.click();
  const appliedCompaniesButton = document.querySelector(
    '[aria-controls="companies-applied-list"]'
  );
  if (appliedCompaniesButton) {
    appliedCompaniesButton.click();
  }
};

const closeMenu = () => {
  const backToMainMenu = document.querySelector(
    '[data-id="go-back-to-main-menu"]'
  );
  if (backToMainMenu) {
    backToMainMenu.click();
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const companyElements = Array.from(
  document.querySelectorAll('button[data-id="trigger-button"]')
);

openMenu();
const companies = Array.from(companyElements).map((_, index) => {
  const button = companyElements[index];
  button.click();
  const aboutLink = document.querySelector(
    `#radix-${index} a[aria-label^="Sobre"]`
  );
  let companyInfo = {};
  if (aboutLink) {
    console.log("aboutLink: ", aboutLink);
    companyInfo = {
      name: aboutLink.getAttribute("aria-label").replace("Sobre ", ""),
      link: aboutLink.getAttribute("href"),
    };
    console.log(`Company ${index} : `, companyInfo);
  }

  return companyInfo;
});

console.log("voce ja se candidatou para essas empresas:");
console.log(companies);
