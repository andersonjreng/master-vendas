import { trigger, state, style, transition, animate, animateChild, query } from '@angular/animations';


const wClose = "4.7em";
const wOpen = "15em";

export const onSideNavChange = trigger('onSideNavChange', [
  state('close',
    style({
      'width': wClose
    })
  ),
  state('open',
    style({
      'width': wOpen
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);


export const onMainContentChange = trigger('onMainContentChange', [
  state('close',
    style({
      'margin-left': wClose
    })
  ),
  state('open',
    style({
      'margin-left': wOpen
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);


export const animateText = trigger('animateText', [
  state('hide',
    style({
      'display': 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      'display': 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);

export const animateContenListItem = trigger('animateContenListItem', [
  state('hide',
    style({
      "justify-content": "center"
    })
  ),
  state('show',
    style({
      "justify-content": "start"
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);

export const animateLogo = trigger('animateLogo', [
  state('hide',
    style({
      'width': '85%',
      'height': '40px',
      'object-fit': 'contain',
    })
  ),
  state('show',
    style({
      'width': '100%',
      'height': '70px',
      'object-fit': 'contain',
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);
