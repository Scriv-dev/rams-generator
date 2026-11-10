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
        hazard: 'Wind loading on temporary structures (marquees, stages, towers, fencing, banners) causing collapse, uplift or flying debris',
        who: 'Crew, contractors, {public}',
        controls: 'Each structure\'s maximum design wind speed (gust, in m/s or mph) is taken from its supplier\'s design calculations or operations manual and written into the wind action plan (section 5), with amber and red trigger speeds and the action at each. Wind measured with an anemometer mounted clear of obstructions at or near the height of the tallest structure, read every 30 minutes (every 15 minutes at amber) and logged. Gust speed is used for decisions, not the average. Met Office forecast and warnings checked every morning and before each build or event day.',
        rating: 'medium',
        actions: 'Fill in the wind action plan with every structure\'s figures before build starts and brief crew chiefs on who calls amber and red. Name the person responsible for reading and logging the anemometer.',
        outdoor: true
      },
      {
        hazard: 'Rain, lightning, heat or cold affecting crew and ground conditions',
        who: 'Crew, contractors, {public}',
        controls: 'Rain: trackway and matting laid on soft ground, and electrical connectors raised and covered. Lightning: work at height and on metal structures stops when thunder is heard or lightning is seen, and resumes 30 minutes after the last strike. Heat: drinking water, shade and sun cream provided, with heavy work moved to cooler hours. Cold: warm welfare area and hot drinks provided.',
        rating: 'low',
        actions: 'Crew chief to check the forecast each morning and adjust the work plan.',
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
          hazard: 'Electric shock from an earth fault on a final circuit (damaged lead, water ingress, faulty appliance)',
          who: 'Electricians, crew, performers, {public}',
          controls: 'Every final circuit protected by a 30 mA RCD (RCBO or RCD-protected distro way), including all socket outlets up to 32 A and every circuit the public can reach, in line with BS 7671 and BS 7909. Upstream distribution protected by time-delayed (S-type) 100 mA or 300 mA RCDs so a fault trips only the circuit affected. Electrician tests each RCD with an RCD tester before energising: trip time recorded on the BS 7909 installation certificate. No equipment plugged in without RCD protection, including "just for a minute" use.',
          rating: 'medium',
          actions: 'Press the RCD test button on every distro at the start of each day and log the result. Any RCD that fails to trip: isolate the circuit and call the electrician. Do not reset an RCD that trips repeatedly; find and remove the fault first.'
        },
        {
          hazard: 'Electric shock or loss of earth from incorrect generator earthing or a broken protective conductor',
          who: 'Electricians, crew, {public}',
          controls: 'Earthing arrangement (generator star point bonded, earth electrode where the design requires it) set by the system designer and confirmed by test: earth electrode resistance and earth fault loop impedance recorded on the certificate. Generator frame and distribution bonded. Only one generator feeds each system unless designed for paralleling.',
          rating: 'low',
          actions: 'Electrician re-tests earthing if a generator is swapped or moved during the event.'
        },
        {
          hazard: 'Shock or short circuit from unsuitable outdoor connectors and cable',
          who: 'Crew, {public}',
          controls: 'Outdoors, only BS EN 60309 (CEE-form) connectors rated IP44 or better are used; no 13 A domestic plugs, multi-way adaptors or domestic extension reels outside. Connectors kept off the ground on cable stands or in IP-rated boxes away from standing water. Cable is H07RN-F (heavy-duty rubber) or equivalent. Hand tools on site run on 110 V centre-tapped-earth (CTE) supplies or are battery powered.',
          rating: 'low',
          actions: 'Visual check of all leads and connectors before connection; damaged items tagged "DO NOT USE" and removed from site.'
        },
        {
          hazard: 'Cable overheating or fire from coiled cable or undersized cable under load',
          who: 'Crew, {public}',
          controls: 'Cable drums and reels fully unwound before load is applied; surplus cable laid in a loose figure-of-eight, never tight coils. Cable size chosen by the electrician for load, run length and voltage drop. Cable not run under carpet, matting or insulation unless sized for it.',
          rating: 'low',
          actions: 'Electrician to spot-check cable and connector temperatures by touch or thermal camera once the full load is on.'
        },
        {
          hazard: 'Trips over cable runs in pedestrian areas',
          who: 'Crew, {public}',
          controls: 'Cable routes planned on the site plan before arrival: run along fence lines, building edges and the backs of structures, not across open walkways. Where a crossing is unavoidable, cable is laid in a yellow-lidded pedestrian cable protector with bevelled edges (or a wheelchair-accessible ramp on accessible routes), butted together with no gaps, and the ends taped down. Cables crossing an exit route are flown or ramped, never left loose. Power, audio and data run in separate channels of the protector.',
          rating: 'low',
          actions: 'Check every crossing at each site walk; reseat any ramp that has shifted and re-tape lifted ends.'
        },
        {
          hazard: 'Cable crushed or severed where it crosses a vehicle route, causing shock or loss of power',
          who: 'Drivers, crew, {public}',
          controls: 'Vehicle crossings use heavy-duty cable protectors rated for the heaviest vehicle on site (axle load stated by the manufacturer), pinned or ballasted so they cannot creep, with crossing signs on both approaches. Alternatively cable is flown on a cable bridge or catenary with clearance above the tallest vehicle expected and goal-post height markers on each side. Cable is never buried in loose ground or left exposed on a vehicle route.',
          rating: 'low',
          actions: 'Re-inspect vehicle crossings after each delivery window.'
        },
        {
          hazard: 'Generator fire, fuel spillage or exhaust fumes',
          who: 'Crew, {public}',
          controls: 'Generators positioned in ventilated areas away from public and structures; fenced off; spill kits and drip trays provided; refuelling only when stopped and cool; fire extinguisher at each generator.',
          rating: 'low',
          actions: 'Nominate a responsible person for refuelling and log fuel deliveries.'
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
          'Lay cable along the routes on the site plan (fence lines and backs of structures), fully unwinding drums.',
          'Fit yellow-lidded pedestrian protectors at walkway crossings and vehicle-rated protectors (or a flown cable bridge) at vehicle crossings; butt sections together and tape the ends.',
          'Keep CEE-form connectors off the ground on stands or in IP-rated boxes.',
          'Connect distribution boards and final circuits, with a 30 mA RCD on every final circuit.',
          'Electrician to test earthing, loop impedance and every RCD trip time, and issue the BS 7909 certificate before anything is energised.'
        ],
        during: [
          'Electrician on site or on call for the duration of the event.',
          'Press the test button on every RCD at the start of each day and log the result.',
          'Monitor generator fuel levels and refuel only when the generator is stopped and cool.',
          'Check every cable crossing at each site walk and after each delivery window; reseat ramps and re-tape ends.'
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
          hazard: 'Wind loading on stage roof, side wings, banners and flown PA (outdoor stages)',
          who: 'Crew, performers, {public}',
          controls: 'Stage roof and any PA wings or banner frames erected to the engineer\'s design, with ballast of the specified weight and position on every leg or ballast point, and guy wires tensioned as specified. Scrim, banners and backdrops fitted only where the design allows for their wind load, with quick-release fixings or cut-away points so they can be removed fast. The operations manual sets the wind speeds for removing scrim, lowering flown PA and stopping the show, and these go on the wind action plan.',
          rating: 'medium',
          actions: 'Name who removes the scrim and lowers the PA at the amber trigger, and keep the tools they need at the stage.',
          outdoor: true
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
          controls: 'Structure supplied and erected to BS EN 13782 by a competent contractor (e.g. MUTA member), with a stated maximum design wind speed. Stakes of the length, number and spacing given in the design calculations, or ballast of the stated weight per leg where staking is not possible (hard standing, buried services). Stakes checked for lift and ratchet straps for tension after erection and each morning. Walls and doors kept fully closed on the windward side in strong winds so wind cannot get under the roof; walls never removed on one side only. At the amber trigger speed: close all walls and doors and stop people entering. At the red trigger speed: evacuate the structure to the agreed assembly point.',
          rating: 'medium',
          actions: 'Get the structure\'s design calculations, maximum wind speed and handover certificate before use, and enter its trigger speeds on the wind action plan.'
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
          hazard: 'Temporary (Heras-type) fence lines blown over by wind, falling onto people',
          who: 'Crew, stewards, {public}',
          controls: 'Every panel sits in a rubber or concrete foot. Panels joined with a coupler at top and bottom of every joint, bolts facing the secure side. Unclad runs: a stabiliser stay with its own ballast foot (or pinned) at least every 4th panel, and at every end, corner, gate post and change of direction. Runs with scrim, mesh or branding: stay and ballast on every panel, or as the supplier\'s wind-loading guidance requires, because clad fencing acts as a sail. Extra ballast blocks added on exposed or elevated fence lines.',
          rating: 'medium',
          actions: 'Get the fence supplier\'s wind-loading guidance before fitting any scrim or banners. Record the wind speed at which scrim is cut or dropped on the wind action plan.'
        },
        {
          hazard: 'Fence or barrier anchoring failing on soft ground, slopes or hard standing',
          who: 'Crew, {public}',
          controls: 'Stays pinned with ground stakes on grass where the CAT scan shows no services, and ballasted with extra blocks on hard standing or where staking is not allowed. Feet placed level; on slopes, feet packed level and stays fitted on the downhill side. Water-filled barriers filled to the marked level and checked daily for leaks. Water-filled barriers are not used to stop vehicles unless they are crash-rated for that purpose.',
          rating: 'low',
          actions: 'Walk every fence line after heavy rain, high winds or vehicle movements and re-level or re-ballast as needed.'
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
          controls: 'Front-of-stage and other crowd barriers are engineered systems (not pedestrian barriers or Heras fencing) rated for the crowd load in the barrier design, with the base plate on the crowd side. Pedestrian barriers interlocked along their full length and used only for queue lines and low-density areas. Emergency gates in fence lines marked, kept clear on both sides and staffed or monitored. Layout agreed with the event safety officer.',
          rating: 'medium',
          actions: 'Confirm barrier plan and exit gates against the event management plan.'
        }
      ],
      method: {
        setup: [
          'Mark out fence and barrier lines from the site plan, including emergency gates.',
          'Deliver panels by vehicle as close as practicable to the fence line.',
          'CAT scan stay positions before any stakes go into the ground.',
          'Place feet, then panels, fixing couplers at the top and bottom of every joint.',
          'Fit stabiliser stays with ballast or stakes at least every 4th panel, every panel on clad runs, and at all ends, corners and gates.',
          'Fit scrim or banners only after the bracing is complete and only to the supplier\'s wind-loading guidance.',
          'Install crowd barriers, check alignment and make sure emergency gates open freely.'
        ],
        during: [
          'Patrol fence lines and repair any damage, gaps or missing couplers.',
          'Act on the wind action plan: cut or drop scrim at its trigger speed.',
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
          hazard: 'Wind loading on outdoor ground-support towers, flown PA, screens and truss banners',
          who: 'Crew, performers, {public}',
          controls: 'Ground-support towers ballasted and guyed as set in the supplier\'s calculations for the actual load hung, including any LED screen or banner, which add wind load. Outrigger feet on spreader plates. Banners on truss fitted with wind slits or quick-release fixings. Flown PA lowered to the deck and screens taken down at the speeds the operations manual gives.',
          rating: 'medium',
          actions: 'Enter the tower and screen trigger speeds on the wind action plan.',
          outdoor: true
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
          hazard: 'Pedestrians struck by vehicles or plant on shared site routes',
          who: 'Crew, contractors, {public}',
          controls: 'Traffic management plan with a site map showing separate vehicle routes and pedestrian walkways. Walkways separated from vehicle routes by physical barriers (pedestrian barriers or Heras fencing), not tape or cones alone. Pedestrian and vehicle gates are separate; where the two must cross, a marked crossing point with signs on both approaches and drivers giving way. One-way vehicle loop wherever the site allows, to cut out reversing. 5 mph (8 km/h) site speed limit signed at every vehicle entrance. Routes lit for work after dark.',
          rating: 'medium',
          actions: 'Issue the site map to all suppliers with their delivery slot. Gate staff brief every driver on arrival: route, speed limit, crossing points and where to park.'
        },
        {
          hazard: 'People struck or crushed during reversing and manoeuvring in loading areas',
          who: 'Crew, drivers, banksmen',
          controls: 'All reversing and manoeuvring in loading areas controlled by a trained banksman in hi-vis, using agreed hand signals and standing where the driver can see them at all times. If the driver loses sight of the banksman, they stop. Loading bays marked as vehicle-only zones: crew stay behind the barrier line until the vehicle has stopped, the engine is off and the handbrake is on. Drivers wait in the cab or in a marked safe area while being loaded or unloaded.',
          rating: 'medium',
          actions: 'Name the banksmen for each delivery window on the crew sheet.'
        },
        {
          hazard: 'People struck by forklifts or telehandlers moving or lifting loads',
          who: 'Crew, {public}',
          controls: 'Exclusion zone of at least the machine\'s full reach (or as set by the lift plan) coned and barriered around plant while it lifts; no one walks under a raised load. Plant fitted with a working beacon and reversing alarm. Forks lowered and machine parked in a designated area when not in use, with keys removed.',
          rating: 'medium',
          actions: 'Crew chief to check daily pre-use checks are recorded for each machine.'
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
          controls: 'Vehicle curfew while the public are on site. Any essential movement (and all emergency vehicle access) is at walking pace, hazard lights on, with a steward in hi-vis walking ahead to clear the route. Emergency vehicle routes kept clear and marked on the site map.',
          rating: 'low',
          actions: 'Set up vehicle curfew times and communicate them to all suppliers.'
        }
      ],
      method: {
        setup: [
          'Issue the traffic management plan and delivery schedule to all suppliers.',
          'Install barriers between walkways and vehicle routes, separate pedestrian and vehicle gates, marked crossing points and 5 mph signs before the first delivery arrives.',
          'Lay trackway where ground conditions require it.',
          'Check plant operator certification on arrival; banksman to control all reversing and manoeuvres.',
          'Coned and barriered exclusion zone around plant while it lifts; no one under a raised load.'
        ],
        during: [
          'Enforce the vehicle curfew; any essential movement at walking pace, hazard lights on, with a steward walking ahead.',
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
          controls: 'Equipment set up on firm level ground; outriggers and stabilisers deployed on spreader pads; pre-use inspections carried out and recorded; ladders used only for short-duration, low-risk work.',
          rating: 'low',
          actions: 'None beyond existing controls.'
        },
        {
          hazard: 'MEWP or tower overturning, or operator thrown from the platform, in wind',
          who: 'Operators, crew, {public}',
          controls: 'MEWPs not operated above the maximum wind speed on the machine\'s data plate (commonly 12.5 m/s, about 28 mph, for outdoor-rated machines; indoor-only machines not used outdoors at all). Mobile towers used outdoors only within the manufacturer\'s wind limit, with stabilisers fitted and ballast if the manual requires it; towers tied in or taken down if the forecast exceeds the limit. Wind read at platform height with a handheld anemometer before going up and while working. No sheeting or banners carried on a platform in wind.',
          rating: 'medium',
          actions: 'Operators record the wind reading on the pre-use check sheet before each use.',
          outdoor: true
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

  /* Wind action plan rows, shown for outdoor events when the matching activity is ticked.
     Speeds are left blank: they must come from each structure's own design figures. */
  windPlan: [
    {
      activity: 'marquee',
      structure: 'Marquee / tent',
      amber: 'Close all walls and doors; stop people entering; check stakes and straps.',
      red: 'Evacuate the structure to the assembly point; keep everyone clear of guy lines.'
    },
    {
      activity: 'staging',
      structure: 'Stage roof, wings and banners',
      amber: 'Remove scrim and backdrops; prepare to lower flown PA; brief performers.',
      red: 'Stop the show; lower PA; clear the stage and the area in front of it.'
    },
    {
      activity: 'rigging',
      structure: 'Ground-support towers, flown PA and screens',
      amber: 'Remove truss banners; prepare to lower PA and screens.',
      red: 'Lower PA and screens to the deck; set an exclusion zone around the towers.'
    },
    {
      activity: 'fencing',
      structure: 'Fence lines with scrim or branding',
      amber: 'Add ballast at exposed runs; prepare to cut or drop scrim.',
      red: 'Cut or drop all scrim; move people away from clad fence lines.'
    },
    {
      activity: 'height',
      structure: 'MEWPs and mobile towers',
      amber: 'Finish the current task and bring the platform down.',
      red: 'No work at height; MEWPs stowed; towers tied in or dismantled.'
    }
  ],

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
