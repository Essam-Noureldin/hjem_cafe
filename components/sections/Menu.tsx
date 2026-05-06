/**
 * WHAT: The Menu section — what Hjem serves, broken into five category
 *       groups (Bakery, Pastries, Kitchen, Coffee, Tea & Matcha) with
 *       editorial two-column layout, a featured photograph per category,
 *       prices, and a one-line indicative-prices disclaimer.
 * WHY:  Hjem's pitch is "Danish bakery you can trust to make the
 *       cardamom bun properly." The menu is where that promise gets
 *       specific, and one photograph per category sells it harder than
 *       a text-only list — visitors decide on cardamom buns by *seeing*
 *       cardamom buns.
 * IF REMOVED: the homepage's Visit CTA points at a place with no
 *             advertised offering — visitors would arrive cold.
 *
 * Data shape: MENU is a const array of categories, each carrying an
 * image path + alt + an items array. To swap real items in once Hjem
 * confirms them, edit MENU and nothing else — the JSX iterates blindly
 * so any data change here cascades automatically.
 *
 * Speculative content: every item, price, and the imagery prompts that
 * generated the photographs are educated guesses (Spring 2026 plausible).
 * The disclaimer at the bottom of the section names this hedge. See
 * Session 6 deviations 6.4 (prices) and 6.2 (AI imagery) in
 * MASTER_PROMPT_DEVIATIONS.md.
 *
 * Image fallback: each category column carries a `bg-cream` block under
 * the <Image>. If a `/images/menu/*.jpg` file is missing the layout
 * still reads as intentional rather than as a broken design.
 *
 * Accessibility: each category is an <h3> followed by an Image and a
 * <dl> of items. <dt> carries the name + price, <dd> carries the
 * description. Screen readers announce these as a definition list,
 * which is the correct shape for a menu.
 */

import Image from "next/image";

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
  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="bg-cream px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
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

        {/* Two-column on lg+, single column on smaller screens. gap-y is
            generous so each category reads as its own self-contained
            block — image, heading, list — rather than a fragmented run
            of items. */}
        <div className="mt-16 grid gap-y-16 lg:grid-cols-2 lg:gap-x-16">
          {MENU.map((category) => (
            <div key={category.heading}>
              {/* Featured photograph. aspect-[4/3] keeps the layout
                  stable while images load. bg-cream beneath fills the
                  frame if the source is missing. priority={false}
                  (default) — these images are below the fold; LCP
                  remains the Hero. */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="object-cover"
                />
              </div>

              <h3 className="mt-6 font-display text-2xl text-ink sm:text-3xl">
                {category.heading}
              </h3>

              <dl className="mt-6 space-y-5">
                {category.items.map((item) => (
                  <div key={item.name}>
                    <dt className="flex items-baseline justify-between gap-4 font-body text-base text-ink">
                      <span className="font-medium">{item.name}</span>
                      {/* Dotted leader between name and price feels like
                          a printed menu without leaning into the cliché.
                          flex-grow border sits at the baseline of the
                          surrounding text. */}
                      <span
                        aria-hidden="true"
                        className="mb-1 flex-1 border-b border-dotted border-ink/20"
                      />
                      <span className="tabular-nums text-ink/80">
                        {item.price}
                      </span>
                    </dt>
                    <dd className="mt-1 font-body text-sm text-ink/60">
                      {item.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-16 font-body text-xs uppercase tracking-widest text-ink/50">
          Prices indicative. See in-store for current offering.
        </p>
      </div>
    </section>
  );
}
