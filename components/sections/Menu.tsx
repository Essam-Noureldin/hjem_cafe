/**
 * WHAT: The Menu section — five category cards (Bakery, Pastries,
 *       Kitchen, Coffee, Tea & Matcha) rendered as a horizontal
 *       scrollable carousel. Each card holds the category's featured
 *       photograph, name, item list with prices, and the indicative-
 *       prices disclaimer sits beneath the carousel.
 * WHY:  The BakeMyDay-inspired redesign leans into card carousels.
 *       Replacing the static two-column editorial list with a
 *       horizontal carousel keeps all the content density (every item,
 *       every price, every description) while giving the section the
 *       active, scrollable feel of a restaurant menu site.
 * IF REMOVED: the homepage's Visit CTA points at a place with no
 *             advertised offering — visitors arrive cold.
 *
 * Layout:
 *   - bg-cream — light section, continues the lighter-band rhythm
 *     between the moss Story above and (eventually) the Visit below.
 *   - Track carousel with wide cards: ~90% mobile (one visible), ~60%
 *     sm (one + peek), ~45% lg (two + peek). Wide enough to fit a 4:3
 *     image + heading + ~4 items vertically without cramping.
 *   - arrowsPosition="outside" + controlsTheme="dark" because cards
 *     are bg-bone on bg-cream — overlay arrows would have weak
 *     contrast.
 *   - No autoplay — users browse menus at their own pace.
 *
 * Speculative content: items + prices are educated guesses (Spring
 * 2026 plausible UK indie-café). Disclaimer at the section foot
 * names the hedge. See Session 6 deviation 6.4.
 */

import Image from "next/image";
import Carousel from "@/components/Carousel";

interface MenuItem {
  name: string;
  price: string;
  description: string;
}

interface MenuCategory {
  heading: string;
  image: string;
  imageAlt: string;
  items: MenuItem[];
}

const MENU: ReadonlyArray<MenuCategory> = [
  {
    heading: "Bakery",
    image: "/images/menu/bakery.jpeg",
    imageAlt:
      "Three Danish loaves on a marble surface — sourdough, dark rye and spelt — dusted with flour.",
    items: [
      {
        name: "Stone-milled sourdough",
        price: "£5.50",
        description: "Long-fermented, deep crust, open crumb.",
      },
      {
        name: "Rugbrød",
        price: "£5.00",
        description: "Dense Danish dark rye, seeded, baked daily.",
      },
      {
        name: "Spelt loaf",
        price: "£6.00",
        description: "Softer crumb, nutty, light caraway.",
      },
    ],
  },
  {
    heading: "Pastries",
    image: "/images/menu/pastries.jpeg",
    imageAlt:
      "Cardamom buns dusted with pearl sugar, a cinnamon swirl and a poppyseed pastry on cream linen.",
    items: [
      {
        name: "Kardemommebolle",
        price: "£3.80",
        description: "Our cardamom bun. The reason most people walk in.",
      },
      {
        name: "Kanelsnegle",
        price: "£3.80",
        description: "Cinnamon swirl, brown-butter glaze.",
      },
      {
        name: "Tebirkes",
        price: "£3.50",
        description: "Poppyseed pastry, marzipan core.",
      },
      {
        name: "Spandauer",
        price: "£3.80",
        description: "Vanilla custard, lemon glaze.",
      },
    ],
  },
  {
    heading: "Kitchen",
    image: "/images/menu/kitchen.jpeg",
    imageAlt:
      "Open-faced smørrebrød with cured fish and dill, a jar of house kimchi, and sourdough toast with cultured butter.",
    items: [
      {
        name: "Smørrebrød",
        price: "£8.50",
        description: "Open rye sandwich, weekly seasonal topping.",
      },
      {
        name: "House kimchi",
        price: "£4.00",
        description: "Fermented in-house, served with sourdough.",
      },
      {
        name: "Sourdough toast",
        price: "£4.50",
        description: "Cultured butter, Maldon salt.",
      },
    ],
  },
  {
    heading: "Coffee",
    image: "/images/menu/coffee.jpeg",
    imageAlt:
      "A flat white with a delicate latte-art rosette on a small ceramic saucer, espresso machine soft-focused behind.",
    items: [
      {
        name: "Espresso",
        price: "£2.80",
        description: "Single origin, rotated monthly.",
      },
      {
        name: "Flat white",
        price: "£3.60",
        description: "Whole milk or oat.",
      },
      {
        name: "Filter",
        price: "£3.20",
        description: "Brewed slow, served black.",
      },
      {
        name: "Cold brew",
        price: "£4.00",
        description: "Eighteen-hour steep, served over ice.",
      },
    ],
  },
  {
    heading: "Tea & Matcha",
    image: "/images/menu/matcha.jpeg",
    imageAlt:
      "Bright-green ceremonial matcha in a dark ceramic chawan, bamboo whisk resting beside it on cream linen.",
    items: [
      {
        name: "Ceremonial matcha",
        price: "£4.80",
        description: "Whisked, served warm in a small bowl.",
      },
      {
        name: "Iced matcha",
        price: "£4.80",
        description: "Whole milk or oat, lightly sweetened.",
      },
      {
        name: "Loose-leaf",
        price: "£3.20",
        description: "Black, green, or herbal — see counter.",
      },
    ],
  },
];

export default function Menu() {
  const slides = MENU.map((category) => (
    <article
      key={category.heading}
      className="flex h-full flex-col overflow-hidden bg-bone shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full bg-cream">
        <Image
          src={category.image}
          alt={category.imageAlt}
          fill
          sizes="(min-width: 1024px) 30rem, (min-width: 640px) 60vw, 90vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl text-ink sm:text-3xl">
          {category.heading}
        </h3>
        <dl className="mt-5 space-y-4">
          {category.items.map((item) => (
            <div key={item.name}>
              <dt className="flex items-baseline justify-between gap-3 font-body text-base text-ink">
                <span className="font-medium">{item.name}</span>
                <span
                  aria-hidden="true"
                  className="mb-1 flex-1 border-b border-dotted border-ink/20"
                />
                <span className="tabular-nums text-ink/80">{item.price}</span>
              </dt>
              <dd className="mt-1 font-body text-sm text-ink/60">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  ));

  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="bg-cream px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-body text-sm uppercase tracking-widest text-clay">
          Menu
        </p>
        <h2
          id="menu-heading"
          className="mt-2 font-display text-4xl text-ink sm:text-5xl"
        >
          What we serve
        </h2>
        <p className="mt-4 max-w-xl font-body text-base text-ink/70">
          A small kitchen, a Danish heart, a London neighbourhood.
          Everything below is baked, fermented, or pulled here.
        </p>

        {/* Wider padding on the carousel container than on Today's
            bench because Menu cards are taller (full item lists) — gives
            the prev/next arrows space without touching the cards. */}
        <div className="mt-12 px-2 sm:px-12">
          <Carousel
            ariaLabel="Hjem menu categories"
            slides={slides}
            slideClassName="min-w-0 flex-[0_0_90%] sm:flex-[0_0_60%] lg:flex-[0_0_45%]"
            gapClassName="gap-5"
            arrowsPosition="outside"
            controlsTheme="dark"
            showDots
            autoplay={false}
            loop
          />
        </div>

        <p className="mt-12 font-body text-xs uppercase tracking-widest text-ink/50">
          Prices indicative. See in-store for current offering.
        </p>
      </div>
    </section>
  );
}
