import puppeteer from 'puppeteer';

async function getDataFromWebPage() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200
    });

    const page = await browser.newPage();
    await page.goto('https://ciudaddecorrientes.gov.ar/tramites/tramites-no-municipales/tramitar-dni');

    const container = await page.$('ul.sticky');
    if (container) {
        const listItems = await container.$$('li');
        for (const li of listItems) {
            const img = await li.$('img');
            if (img) {
                const src = await page.evaluate(el => el.src, img);
                if (src === 'https://ciudaddecorrientes.gov.ar/sites/default/modules/custom/field_icontext/icons/costo.png') {
                    const paragraph = await li.$('p');
                    if (paragraph) {
                        const text = await page.evaluate(el => el.textContent.trim(), paragraph);
                        console.log('Texto del párrafo:', text);
                    }
                }
            }
        }
    } else {
        console.log('No se encontró ningún elemento ul.sticky en la página.');
    }

    await browser.close();
}

getDataFromWebPage();


// https://ciudaddecorrientes.gov.ar/tramites/infracciones/certificado-libre-de-deuda-infracciones-y-antecedentes