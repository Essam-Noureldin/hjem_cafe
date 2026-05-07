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
 * Item names + prices: synced with the printed in-store counter
 * menu (photographed by Essam Session 6). Descriptions remain my
 * minimal interpretation — see Session 6 deviation 6.6.
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

/**
 * MENU data — synced with the in-store counter menu photographed by
 * Essam (Session 6). Three categories, names + prices verbatim from
 * the printed menu. Descriptions are minimal-and-conservative —
 * factual where possible (GF, Danish origin, "ask the bakers"), kept
 * short where any embellishment would be a guess.
 *
 * Drinks (coffee, tea, matcha) are not listed here — the printed
 * menu we have is bakery-only. Those return when we have a confirmed
 * drinks menu.
 */
const MENU: ReadonlyArray<MenuCategory> = [
  {
    heading: "HJEMmade Bakery",
    image: "/images/menu/hjemmade.jpeg",
    imageAlt:
      "Slice of Danish dream cake with caramel-coconut topping, a fudgy brownie, oat flapjacks and a matcha sponge top on cream linen.",
    items: [
      {
        name: "Almond Chocolate Cake (GF)",
        price: "£4.50",
        description: "Gluten-free.",
      },
      {
        name: "Sugar Free Banana Bread (GF)",
        price: "£4.50",
        description: "No added sugar, gluten-free.",
      },
      {
        name: "Brownie",
        price: "£4.00",
        description: "Dense, fudgy.",
      },
      {
        name: "Danish Dream Cake",
        price: "£4.00",
        description: "Drømmekage — caramel and coconut topping.",
      },
      {
        name: "“You know which” Cake",
        price: "£4.00",
        description: "Ask at the counter.",
      },
      {
        name: "American Chocolate Chip Cookie",
        price: "£4.00",
        description: "Soft middle, crisp edge.",
      },
      {
        name: "Matcha Tops (GF)",
        price: "£4.00",
        description: "Matcha sponge top, gluten-free.",
      },
      {
        name: "Healthy Flap Jacks (GF)",
        price: "£3.75",
        description: "Oats, gluten-free.",
      },
      {
        name: "Vegan Almond Chocolate Cranberry Cookies",
        price: "£3.25",
        description: "Plant-based.",
      },
      {
        name: "Raspberry Bliss",
        price: "£4.50",
        description: "Raspberry slice.",
      },
      {
        name: "Bake of the day",
        price: "£4.50",
        description: "Whatever's been pulled this morning — ask the bakers.",
      },
    ],
  },
  {
    heading: "Buns & Pastries",
    image: "/images/menu/pastries.jpeg",
    imageAlt:
      "Cardamom buns dusted with pearl sugar, a cinnamon roll and a poppyseed pastry on cream linen.",
    items: [
      {
        name: "Cardamom Bun",
        price: "£3.90",
        description: "Hand-shaped, sugar-glazed.",
      },
      {
        name: "Cinnamon Roll",
        price: "£3.90",
        description: "Soft-set glaze.",
      },
      {
        name: "Vanilla Bun",
        price: "£4.25",
        description: "Vanilla-cream centre.",
      },
      {
        name: "Savoury Buns",
        price: "£4.25",
        description: "Daily seasonal filling.",
      },
      {
        name: "Special Bun of the day",
        price: "£4.50",
        description: "Whatever the bakers are testing this week.",
      },
      {
        name: "Ryebread (large)",
        price: "£11.50",
        description: "Danish rugbrød, full loaf.",
      },
      {
        name: "Ryebread (small)",
        price: "£6.50",
        description: "Danish rugbrød, half loaf.",
      },
    ],
  },
  {
    heading: "Bread Station",
    image: "/images/menu/bakery.jpeg",
    imageAlt:
      "Stone-milled sourdough loaves on a wooden bench, lightly dusted with flour.",
    items: [
      {
        name: "Croissant",
        price: "£3.20",
        description: "Slow-laminated, baked daily.",
      },
      {
        name: "Cinnamon Roll",
        price: "£3.90",
        description: "Bread-station bake.",
      },
      {
        name: "Seeded Sourdough Loaf",
        price: "£7.50 / £3.90",
        description: "Multi-seed. Full / half.",
      },
      {
        name: "Plain Sourdough Loaf",
        price: "£6.50 / £3.20",
        description: "Long-fermented, stone-milled. Full / half.",
      },
      {
        name: "Sourdough Baguette",
        price: "£3.00",
        description: "Crisp crust, open crumb.",
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
          Menu indicative. Items rotate — ask the bakers for
          today&apos;s bench.
        </p>
      </div>
    </section>
  );
}
