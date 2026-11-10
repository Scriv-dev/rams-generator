/*
 * RAMS content library.
 *
 * Tokens replaced at render time:
 *   {public}  – the audience for this event type (e.g. "guests", "festival-goers")
 *
 * Risk ratings are the residual rating with the listed existing controls in place.
 */

window.RAMS_DATA = {
  eventTypes: {
    festival: {
      label: 'Festival',
      public: 'festival-goers',
      scope: 'a multi-day outdoor festival with large crowds, temporary infrastructure and multiple contractors on site',
      guidance: 'The Purple Guide to Health, Safety and Welfare at Music and Other Events'
    },
    corporate: {
      label: 'Corporate event',
      public: 'delegates',
      scope: 'a corporate event, typically within a managed venue, with delegates, venue staff and third-party suppliers present',
      guidance: 'venue house rules and the HSE guidance on running events safely'
    },
    wedding: {
      label: 'Wedding',
      public: 'guests',
      scope: 'a wedding with guests of all ages, including children, older people and people with reduced mobility',
      guidance: 'venue house rules and the HSE guidance on running events safely'
    },
    outdoor: {
      label: 'Outdoor show',
      public: 'visitors',
      scope: 'an outdoor show with visitors, exhibitors, vehicles and temporary structures sharing the site',
      guidance: 'The Purple Guide to Health, Safety and Welfare at Music and Other Events'
    }
  },

  /* Always included: general site hazards. Outdoor-only rows flagged with outdoor:true. */
  general: {
    label: 'General site conditions',
    hazards: [
      {
        hazard: 'Slips, trips and falls from uneven ground, cables, packaging and wet surfaces',
        who: 'Crew, contractors, venue staff, {public}',
        controls: 'Walkways kept clear; cables routed away from walkways or covered with cable ramps; packaging removed promptly; wet areas signed; suitable footwear worn by all crew.',
        rating: 'medium',
        actions: 'Site walk at start of each shift; crew chief to monitor housekeeping throughout.'
      },
      {
        hazard: 'Adverse weather – high wind, rain, lightning, heat or cold',
        who: 'Crew, contractors, {public}',
        controls: 'Weather forecast checked daily; wind speed monitored with anemometer; work stopped at manufacturer limits for structures; water, shade and warm clothing available.',
        rating: 'medium',
        actions: 'Agree a written adverse weather plan with wind-speed trigger points before build starts.',
        outdoor: true
      },
      {
        hazard: 'Fire from electrical equipment, heaters, cooking or smoking',
        who: 'Everyone on site',
        controls: 'Fire risk assessment in place; suitable extinguishers at key points; fire exits and routes kept clear; no smoking except in designated areas; flame-retardant materials used.',
        rating: 'low',
        actions: 'Brief all crew on fire assembly point and alarm procedure at induction.'
      },
      {
        hazard: 'Interaction between build work and members of the public or venue users',
        who: '{public}, venue staff',
        controls: 'Work areas segregated with barriers and signage; build completed before doors open where possible; crew supervise any work near public areas.',
        rating: 'low',
        actions: 'Confirm build and break schedule against public access times with the client.'
      },
      {
        hazard: 'Fatigue from long working hours and early or late shifts',
        who: 'Crew, contractors',
        controls: 'Shift patterns planned with adequate breaks; welfare facilities with drinking water provided; crew rotated on demanding tasks.',
        rating: 'medium',
        actions: 'Crew chief to monitor hours and stand down anyone showing signs of fatigue.'
      }
    ]
  },

  activities: {
    power: {
      label: 'Power distribution',
      short: 'Temporary power, generators and cable runs',
      hazards: [
        {
          hazard: 'Electric shock or electrocution from temporary supplies, damaged cables or connectors',
          who: 'Electricians, crew, {public}',
          controls: 'System designed and installed by a competent electrician in line with BS 7909; RCD protection on final circuits; all equipment PAT tested and visually inspected before use; IP-rated connectors used outdoors.',
          rating: 'medium',
          actions: 'Electrical installation to be tested and certified before energising; certificate kept on site.'
        },
        {
          hazard: 'Generator fire, fuel spillage or exhaust fumes',
          who: 'Crew, {public}',
          controls: 'Generators positioned in ventilated areas away from public and structures; fenced off; spill kits and drip trays provided; refuelling only when stopped and cool; fire extinguisher at each generator.',
          rating: 'low',
          actions: 'Nominate a responsible person for refuelling and log fuel deliveries.'
        },
        {
          hazard: 'Trip hazard and cable damage from cable runs across walkways and vehicle routes',
          who: 'Crew, {public}',
          controls: 'Cables routed overhead or around walkways where possible; heavy-duty cable ramps used at crossings; cables protected from vehicle traffic.',
          rating: 'low',
          actions: 'Check cable runs at each site walk and replace any damaged ramps.'
        },
        {
          hazard: 'Overloading of circuits or distribution leading to overheating',
          who: 'Crew, {public}',
          controls: 'Load calculations completed by electrician; correctly rated distribution boards; no daisy-chaining of extension leads.',
          rating: 'low',
          actions: 'Electrician to check loads once all equipment is connected.'
        }
      ],
      method: {
        setup: [
          'Confirm power plan, load calculations and generator positions with the site electrician.',
          'Position generators on level ground with drip trays, fencing, signage and a fire extinguisher.',
          'Lay cable runs along agreed routes, fitting cable ramps at all pedestrian and vehicle crossings.',
          'Connect distribution boards and final circuits; electrician to inspect, test and certify before energising.'
        ],
        during: [
          'Electrician on site or on call for the duration of the event.',
          'Monitor generator fuel levels and refuel only when the generator is stopped and cool.',
          'Check cable runs and ramps for damage or displacement at regular intervals.'
        ],
        packdown: [
          'Electrician to isolate and confirm all circuits are dead before disconnection begins.',
          'Disconnect final circuits first, then distribution, then generators.',
          'Coil cables neatly, inspect for damage and tag any faulty items for repair.'
        ]
      }
    },

    staging: {
      label: 'Staging',
      short: 'Stage decks, risers and steps',
      hazards: [
        {
          hazard: 'Collapse or instability of stage structure',
          who: 'Crew, performers, {public}',
          controls: 'Stage erected by trained crew to manufacturer instructions and engineer’s design; ground bearing checked; legs on base plates or sole boards; structure checked and signed off by competent person before use.',
          rating: 'medium',
          actions: 'Obtain structural calculations and handover certificate for the stage.'
        },
        {
          hazard: 'Falls from stage edges or unguarded openings',
          who: 'Crew, performers',
          controls: 'Handrails or edge protection on open edges above 600mm where practicable; stage edges marked with white or hi-vis tape; steps fitted with handrails; stage lighting adequate.',
          rating: 'medium',
          actions: 'Brief performers on stage layout and edges before first use.'
        },
        {
          hazard: 'Crush or impact injuries while handling heavy deck panels',
          who: 'Crew',
          controls: 'Two-person lifts for decks; safety boots and gloves worn; trolleys used to move decks; team lifting briefed.',
          rating: 'low',
          actions: 'None beyond existing controls.'
        }
      ],
      method: {
        setup: [
          'Check ground conditions and mark out stage footprint according to the site plan.',
          'Lay sole boards or base plates and level the substructure.',
          'Install deck panels using two-person lifts, locking each panel into place.',
          'Fit handrails, edge protection, steps and edge marking.',
          'Competent person to inspect and sign off the stage before it is handed over.'
        ],
        during: [
          'Keep stage clear of unnecessary equipment and trailing cables.',
          'Restrict access to authorised crew and performers only.',
          'Re-check levels and connections if heavy rain or ground movement occurs.'
        ],
        packdown: [
          'Clear all equipment from the stage before dismantling begins.',
          'Remove handrails and steps, then lift decks in reverse order of build.',
          'Stack decks on trolleys or pallets, keeping stacks stable and within safe heights.'
        ]
      }
    },

    marquee: {
      label: 'Marquee or tent',
      short: 'Temporary demountable structures',
      hazards: [
        {
          hazard: 'Structure collapse or uplift in high winds',
          who: 'Crew, {public}',
          controls: 'Structure supplied and erected to BS EN 13782 by a competent contractor (e.g. MUTA member); anchoring or ballast to design calculations; wind speed monitored with defined evacuation and closure limits.',
          rating: 'medium',
          actions: 'Obtain the structure’s design calculations, wind limits and handover certificate before use.'
        },
        {
          hazard: 'Striking underground services when staking',
          who: 'Crew, {public}',
          controls: 'Service drawings obtained from the venue; cable avoidance tool (CAT) scan before staking; ballast used where services cannot be confirmed.',
          rating: 'low',
          actions: 'Record service locations on the site plan.'
        },
        {
          hazard: 'Injury from frame sections, guy ropes and stakes during erection',
          who: 'Crew',
          controls: 'Crew trained in erection procedure; hard hats, gloves and safety boots worn; guy ropes and stakes marked or covered; exclusion zone during raising.',
          rating: 'medium',
          actions: 'Supervisor to brief crew on the lift sequence before raising frames.'
        },
        {
          hazard: 'Fire spread within the structure',
          who: '{public}, crew',
          controls: 'Fabric certified flame retardant; exits clearly signed and lit; extinguishers provided; no naked flames or heaters without approval.',
          rating: 'low',
          actions: 'Keep the flame-retardancy certificate on site for inspection.'
        }
      ],
      method: {
        setup: [
          'Obtain service drawings and scan the area with a CAT before marking out.',
          'Mark out the footprint and lay out frame components and fabric.',
          'Assemble the frame at ground level, then raise sections with sufficient crew inside an exclusion zone.',
          'Fit anchors, stakes or ballast according to the design; tension guys and mark trip hazards.',
          'Install fabric, exit signage, lighting and extinguishers.',
          'Contractor to complete handover inspection and certificate before occupancy.'
        ],
        during: [
          'Monitor wind speed and follow agreed actions at each trigger level, including closure and evacuation.',
          'Check anchors, ballast and fabric tension at regular intervals.',
          'Keep exits and gangways clear at all times.'
        ],
        packdown: [
          'Ensure the structure is empty of people and contents.',
          'Remove fabric and fittings, then lower frame sections in a controlled way within an exclusion zone.',
          'Remove stakes and fill holes; inspect components and pack for transport.'
        ]
      }
    },

    fencing: {
      label: 'Fencing and barriers',
      short: 'Heras fencing, pedestrian barriers and crowd barriers',
      hazards: [
        {
          hazard: 'Fence panels blown over by wind',
          who: 'Crew, {public}',
          controls: 'Panels secured with couplers, feet and stabilisers at regular intervals; ballast or bracing added in exposed areas; scrim or banners avoided unless design accounts for wind loading.',
          rating: 'medium',
          actions: 'Check fence lines after high winds and before public access.'
        },
        {
          hazard: 'Cuts, pinches and strains when handling panels',
          who: 'Crew',
          controls: 'Cut-resistant gloves and safety boots worn; two-person handling for panels; trolleys and stillages used.',
          rating: 'low',
          actions: 'None beyond existing controls.'
        },
        {
          hazard: 'Crowd pressure on barriers or blocked emergency exits',
          who: '{public}, stewards',
          controls: 'Barrier type suited to expected crowd loading; emergency gates in fence lines kept clear and staffed; layout agreed with event safety officer.',
          rating: 'medium',
          actions: 'Confirm barrier plan and exit gates against the event management plan.'
        }
      ],
      method: {
        setup: [
          'Mark out fence and barrier lines from the site plan, including emergency gates.',
          'Deliver panels by vehicle as close as practicable to the fence line.',
          'Place feet, then panels, fixing couplers top and bottom; fit stabilisers at regular intervals.',
          'Install crowd barriers, check alignment and make sure emergency gates open freely.'
        ],
        during: [
          'Patrol fence lines and repair any damage or gaps.',
          'Keep emergency gates clear and staffed or monitored.'
        ],
        packdown: [
          'Remove couplers and stabilisers, then lift panels onto stillages.',
          'Collect feet and couplers; check that no fixings are left on the ground.'
        ]
      }
    },

    rigging: {
      label: 'Lighting and sound rigging',
      short: 'Trussing, flown lighting, PA and AV equipment',
      hazards: [
        {
          hazard: 'Falling objects from truss or rigging points',
          who: 'Crew, performers, {public}',
          controls: 'Rigging carried out by competent riggers; equipment safety-bonded with secondary suspension; exclusion zone below during flying; hard hats worn; loads within rated limits under LOLER.',
          rating: 'medium',
          actions: 'Keep rigging plot, load calculations and LOLER inspection records on site.'
        },
        {
          hazard: 'Failure of hoists, truss or lifting accessories',
          who: 'Crew, {public}',
          controls: 'All lifting equipment inspected and certified under LOLER; pre-use checks carried out; hoists operated only by trained crew.',
          rating: 'low',
          actions: 'Check certification dates before use and quarantine any out-of-date items.'
        },
        {
          hazard: 'Noise-induced hearing damage during sound checks and performances',
          who: 'Crew, performers, {public}',
          controls: 'Sound levels monitored; hearing protection provided to crew; speakers positioned away from public and crew positions; levels in line with the Control of Noise at Work Regulations 2005.',
          rating: 'medium',
          actions: 'Agree maximum sound levels and monitoring arrangements with the client and venue.'
        },
        {
          hazard: 'Electrical hazards from lighting and audio equipment',
          who: 'Crew, performers',
          controls: 'Equipment PAT tested; supplied from RCD-protected distribution; cables managed and kept away from water.',
          rating: 'low',
          actions: 'None beyond existing controls.'
        }
      ],
      method: {
        setup: [
          'Confirm rigging plot, rigging points and load calculations.',
          'Set up an exclusion zone below the rigging area.',
          'Assemble truss at ground level and fit lighting and audio fixtures with safety bonds.',
          'Raise truss with hoists or ground support towers, checking levels and loads.',
          'Focus lights and run sound checks at agreed times and levels.'
        ],
        during: [
          'Monitor sound levels and hearing protection use.',
          'Keep rigged areas under observation; report any movement or damage immediately.'
        ],
        packdown: [
          'Set up an exclusion zone, then lower truss to working height.',
          'Remove fixtures and safety bonds; derig truss and hoists.',
          'Inspect and pack equipment; tag any faulty items.'
        ]
      }
    },

    vehicles: {
      label: 'Vehicle movements',
      short: 'Deliveries, forklifts, telehandlers and site vehicles',
      hazards: [
        {
          hazard: 'People struck by moving vehicles or plant',
          who: 'Crew, contractors, {public}',
          controls: 'Traffic management plan in place; pedestrians and vehicles segregated; 5mph site speed limit; trained banksmen for all reversing; hi-vis worn by everyone in vehicle areas.',
          rating: 'medium',
          actions: 'Brief all drivers on the traffic management plan when they arrive on site.'
        },
        {
          hazard: 'Overturning of plant or vehicles on soft or uneven ground',
          who: 'Operators, crew',
          controls: 'Ground conditions checked; trackway laid on soft ground; plant operated only by certified operators (e.g. CPCS or NPORS); loads within rated capacity.',
          rating: 'low',
          actions: 'Review ground conditions after heavy rain.'
        },
        {
          hazard: 'Vehicle movements during public access',
          who: '{public}',
          controls: 'No vehicle movements while public are on site, except emergency vehicles or under escort with a steward.',
          rating: 'low',
          actions: 'Set up vehicle curfew times and communicate them to all suppliers.'
        }
      ],
      method: {
        setup: [
          'Issue the traffic management plan and delivery schedule to all suppliers.',
          'Set up vehicle routes, signage, speed limits and pedestrian segregation.',
          'Lay trackway where ground conditions require it.',
          'Check plant operator certification on arrival; banksman to control all reversing and manoeuvres.'
        ],
        during: [
          'Enforce vehicle curfew; any essential movement only under escort with hazard lights on.',
          'Keep emergency vehicle routes clear at all times.'
        ],
        packdown: [
          'Do not let vehicles back on site until the public have left and the area is confirmed clear.',
          'Reinstate traffic management and banksman control for all collections.',
          'Remove trackway last, once all heavy vehicles have left.'
        ]
      }
    },

    height: {
      label: 'Working at height',
      short: 'Ladders, podiums, towers and MEWPs',
      hazards: [
        {
          hazard: 'Falls from height from ladders, towers, MEWPs or structures',
          who: 'Crew, contractors',
          controls: 'Work at height avoided where possible (for example, by assembling at ground level); suitable access equipment selected under the Work at Height Regulations 2005; tower scaffolds built by PASMA-trained staff; MEWPs operated by IPAF-trained staff with harness and lanyard.',
          rating: 'medium',
          actions: 'Check training cards and equipment inspection records before work starts.'
        },
        {
          hazard: 'Objects dropped from height',
          who: 'Crew, {public}',
          controls: 'Tool lanyards used; exclusion zone below work area; toe boards on platforms; hard hats worn in the zone.',
          rating: 'medium',
          actions: 'None beyond existing controls.'
        },
        {
          hazard: 'Unstable access equipment or poor ground conditions',
          who: 'Crew',
          controls: 'Equipment set up on firm level ground; outriggers and stabilisers deployed; pre-use inspections carried out and recorded; ladders used only for short-duration, low-risk work.',
          rating: 'low',
          actions: 'Stop work at height in high winds according to manufacturer limits.'
        }
      ],
      method: {
        setup: [
          'Plan each task at height and choose the safest access equipment.',
          'Check training (PASMA, IPAF) and equipment inspection records.',
          'Set up equipment on firm level ground with stabilisers and an exclusion zone below.',
          'Carry out and record pre-use inspection before each use.'
        ],
        during: [
          'Keep work at height during the event to a minimum, and do it only with an exclusion zone.',
          'Secure or remove access equipment when not in use so the public cannot use it.'
        ],
        packdown: [
          'Use the same controls as during setup: exclusion zone, trained operators and pre-use checks.',
          'Dismantle towers in reverse order of erection, following the manufacturer’s guide.'
        ]
      }
    },

    manual: {
      label: 'Manual handling',
      short: 'Lifting, carrying, pushing and pulling equipment',
      hazards: [
        {
          hazard: 'Musculoskeletal injury from lifting heavy or awkward loads',
          who: 'Crew',
          controls: 'Manual handling assessed in line with the Manual Handling Operations Regulations 1992; mechanical aids (trolleys, pallet trucks, forklifts) used where possible; team lifts for heavy items; crew trained in safe lifting technique.',
          rating: 'medium',
          actions: 'Label heavy flight cases with weights.'
        },
        {
          hazard: 'Crushed fingers or feet when moving and stacking equipment',
          who: 'Crew',
          controls: 'Safety boots and gloves worn; stacks kept stable and within safe heights; clear routes planned before moving loads.',
          rating: 'low',
          actions: 'None beyond existing controls.'
        },
        {
          hazard: 'Repetitive strain from prolonged loading and unloading',
          who: 'Crew',
          controls: 'Tasks rotated; regular breaks; tail lifts and ramps used for loading.',
          rating: 'low',
          actions: 'Crew chief to monitor workload during peak load-in and load-out.'
        }
      ],
      method: {
        setup: [
          'Plan routes from the vehicles to the work areas and clear any obstructions.',
          'Use trolleys, pallet trucks or tail lifts for heavy items; team-lift anything over the safe individual limit.',
          'Remind crew of safe lifting technique at the start-of-shift briefing.'
        ],
        during: [
          'Use mechanical aids for restocking and any moves during the event.'
        ],
        packdown: [
          'Plan load-out order to reduce double handling.',
          'Load vehicles with heaviest items low and secure all loads with straps.'
        ]
      }
    }
  },

  /* General method steps wrapped around the activity-specific ones. */
  method: {
    setupBefore: [
      'All crew to sign in on arrival and attend a site induction and RAMS briefing given by the crew chief.',
      'Check that PPE is worn: safety boots and hi-vis as a minimum, plus task-specific PPE.',
      'Walk the site with the venue or client contact to confirm the layout, access routes, services, first aid and fire points.'
    ],
    setupAfter: [
      'Complete a final site walk to check housekeeping, signage, exits and cable management.',
      'Hand the site over to the client or event manager and record the handover.'
    ],
    duringBefore: [
      'Crew chief remains the point of contact on site and keeps a radio or mobile phone switched on.'
    ],
    duringAfter: [
      'Report all incidents and near misses to the crew chief straight away; record them and report under RIDDOR where required.'
    ],
    packdownBefore: [
      'Do not start pack-down until the public have left the area or the area is securely segregated.',
      'Crew chief to brief crew on the pack-down sequence and any changes to site conditions.'
    ],
    packdownAfter: [
      'Remove all waste and leave the site in the condition agreed with the venue.',
      'Complete a final site walk with the venue contact and record sign-off.'
    ]
  }
};
