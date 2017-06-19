import {
  HTMLTagSpecification, IHTMLTagProvider,
  collectTagsDefault, collectAttributesDefault, collectValuesDefault,
  genAttribute
} from './common';

const u = undefined;

const vueDirectives = [
  genAttribute('v-text', u, 'Updates the element’s `textContent`.'),
  genAttribute('v-html', u, 'Updates the element’s `innerHTML`. XSS prone.'),
  genAttribute('v-show', u, 'Toggle’s the element’s `display` CSS property based on the truthy-ness of the expression value.'),
  genAttribute('v-if', u, 'Conditionally renders the element based on the truthy-ness of the expression value.'),
  genAttribute('v-else', u, 'Denotes the “else block” for `v-if` or a `v-if`/`v-else-if` chain.'),
  genAttribute('v-else-if', u, 'Denotes the “else if block” for `v-if`. Can be chained.'),
  genAttribute('v-for', u, 'Renders the element or template block multiple times based on the source data.'),
  genAttribute('v-on', u, 'Attaches an event listener to the element.'),
  genAttribute('v-bind', u, 'Dynamically binds one or more attributes, or a component prop to an expression.'),
  genAttribute('v-model', u, 'Creates a two-way binding on a form input element or a component.'),
  genAttribute('v-pre', u, 'Skips compilation for this element and all its children.'),
  genAttribute('v-cloak', u, 'Indicates Vue instannce on the element has NOT finishes compilation.'),
  genAttribute('v-once', u, 'Render the element and component once only.'),
  genAttribute('key', u, 'Hint at VNodes identity for VDom diffing, e.g. list rendering'),
  genAttribute('ref', u, 'Register a reference to an element or a child component.'),
  genAttribute('slot', u, 'Used on content inserted into child components to indicate which named slot the content belongs to.')
];


const transitionProps = [
  genAttribute('name', u, 'Used to automatically generate transition CSS class names. Default: "v"'),
  genAttribute('appear', 'b', 'Whether to apply transition on initial render. Default: false'),
  genAttribute('css', 'b', 'Whether to apply CSS transition classes. Defaults: true. If set to false, will only trigger JavaScript hooks registered via component events.'),
  genAttribute('type', 'transType', 'The event, "transition" or "animation", to determine end timing. Default: the type that has a longer duration.'),
  genAttribute('mode', 'transMode', 'Controls the timing sequence of leaving/entering transitions. Available modes are "out-in" and "in-out"; Defaults to simultaneous.')
].concat([
  'enter-class', 'leave-class', 'appear-class',
  'enter-to-class', 'leave-to-class', 'appear-to-class',
  'enter-active-class', 'leave-active-class', 'appear-active-class',
].map(t => genAttribute(t)));

const vueTags = {
  component: new HTMLTagSpecification(
    'A meta component for rendering dynamic components. The actual component to render is determined by the `is` prop.',
    [ genAttribute('is', u, 'the actual component to render'),
      genAttribute('inline-template', 'v', 'treat inner content as its template rather than distributed content')]),
  transition: new HTMLTagSpecification(
    '<transition> serves as transition effects for single element/component. It applies the transition behavior to the wrapped content inside.',
    transitionProps
  ),
  'transition-group': new HTMLTagSpecification(
    'transition group serves as transition effects for multiple elements/components. It renders a <span> by default and can render user specified element via `tag` attribute.',
    transitionProps.concat(
      genAttribute('tag'),
      genAttribute('move-class'))),
  'keep-alive': new HTMLTagSpecification(
    'When wrapped around a dynamic component, <keep-alive> caches the inactive component instances without destroying them.',
    ['include', 'exclude'].map(t => genAttribute(t))
  ),
  slot: new HTMLTagSpecification(
    '<slot> serve as content distribution outlets in component templates. <slot> itself will be replaced.',
    [genAttribute('name', u, 'Used for named slot')]
  ),
  template: new HTMLTagSpecification(
    'The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script.',
    [genAttribute('scoped', u, 'the name of a temporary variable that holds the props object passed from the child')]
  ),

};

const valueSets = {
  transMode: ['out-in', 'in-out'],
  transType: ['transition', 'animation'],
  b: ['true', 'false']
};


export function getVueTagProvider(): IHTMLTagProvider {
  return {
    getId: () => 'vue',
    isApplicable: (languageId) => languageId === 'vue-html',
    collectTags: (collector) => collectTagsDefault(collector, vueTags),
    collectAttributes: (tag: string, collector: (attribute: string, type: string, documentation?: string) => void) => {
      collectAttributesDefault(tag, collector, vueTags, vueDirectives);
    },
    collectValues: (tag: string, attribute: string, collector: (value: string) => void) => {
      collectValuesDefault(tag, attribute, collector, vueTags, vueDirectives, valueSets);
    }
  };
}
