import { MDXProvider } from '@mdx-js/react';
import { Deck, Slide } from '@nkzw/remdx/index.js';
import { ReMDXModule, SlideTransition } from '@nkzw/remdx/types.jsx';
import { createRoot, Root } from 'react-dom/client';

const defaultTransition = {
  enter: {
    opacity: 1,
    transform: 'translateX(0%)',
  },
  from: {
    opacity: 0,
    transform: 'translateX(100%)',
  },
  leave: {
    opacity: 1,
    transform: 'translateX(-100%)',
  },
};

const defaultTransitions: Record<string, SlideTransition> = {
  default: defaultTransition,
  leaveOnly: {
    enter: {
      transform: 'translateX(0%)',
    },
    from: {},
    leave: {
      transform: 'translateX(-100%)',
    },
  },
  none: {
    enter: {},
    from: {},
    leave: {},
  },
  opacity: {
    enter: {
      opacity: 1,
    },
    from: {
      opacity: 0,
    },
    leave: {
      opacity: 1,
    },
  },
  transformRight: {
    enter: {
      transform: 'translateX(0%)',
    },
    from: {
      transform: 'translateX(100%)',
    },
    leave: {
      transform: 'translateX(-100%)',
    },
  },
};

function Image({
  src: source,
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  if (!source) {
    return null;
  }
  const [src, query] = source.split('?');
  return (
    <img
      loading="lazy"
      src={src}
      style={Object.fromEntries(new URLSearchParams(query))}
      {...props}
    />
  );
}

async function slidesToComponent(module: Promise<ReMDXModule>) {
  const {
    Components,
    Container,
    Themes,
    Transitions,
    default: slides,
  } = await module;
  return (
    <MDXProvider
      components={{
        // ...DefaultComponents,
        img: Image,
        ...Components,
      }}
    >
      <Deck
        slides={slides.map(({ Component, data }, index) => (
          <Slide
            container={Container}
            id={index}
            image={data?.image}
            key={index}
            style={Themes?.[data?.theme] || Themes?.default}
            transition={
              Transitions?.[data?.transition] ||
              defaultTransitions[data?.transition] ||
              undefined
            }
          >
            <Component />
          </Slide>
        ))}
      />
    </MDXProvider>
  );
}

const roots = new WeakMap<HTMLElement, Root>();

export async function render(
  element: HTMLElement | null,
  module: Promise<ReMDXModule>,
) {
  if (!element) {
    throw new Error(`remdx: The provided DOM node could not be found.`);
  }

  if (!roots.has(element)) {
    roots.set(element, createRoot(element));
  }

  roots.get(element)?.render(await slidesToComponent(module));
}
