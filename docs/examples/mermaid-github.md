# Mermaid on Github Examples

These were taken from this gist: <https://gist.github.com/ChristopherA/bffddfdf7b1502215e44cec9fb766dfd>

All of these diagrams are dynamically rendered during html display by Github, the images generated from text inside the Github-Flavored Markdown. None are static images. Mermaid support was released for Github on [2022-02-14](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/)

Pros & Cons:

- Pro: You don't need to care about the layout.
- Con: You cannot control the layout.

Notes:

- Not all the features of Mermaid (in particular symbols `B-->C[fa:fa-ban forbidden]`, hyperlink and tooltips) are supported by Github.
- A number of other Markdown features don't work within Mermaid labels but don't break it: `:grinning:`=😀, `*italic*`=_italic_, mathjax `n<sup>2</sup>`=n<sup>2</sup>.
- Many characters, in particular emoji `😀` & some extended ASCII `†¶` (but oddly, not extended ASCII `²`), break Mermaid with errors.
- Some embed GitHub gists and pages into other pages, and this doesn't seem to work (yet).

Docs & Tools:

- [Mermaid Docs](https://mermaid-js.github.io/mermaid/)
- [Mermaid Live Editor](https://mermaid.live/edit) (Also supports copy from Github gists and saving to `.svg` `.png`)
- [Mermaid Cheat Sheet](https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/)

Some real-world examples of Mermaid Diagrams in Github:

- [Pattern: AppDelegate -> Router -> MVP/C](https://gist.github.com/vtsoup/f1f79d19d6f8e58396bde8847c09a62e)
- [Navigation(_italian_)](https://gist.github.com/balanza/39bd68f3978ae7dd6a486321b2251ce7)

## [Graph (aka Flowchart)](https://mermaid-js.github.io/mermaid/#/flowchart)

### Simple Example as Markdown

````markdown
    ```mermaid
    graph LR;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
    ```
````

````markdown
    ```mermaid
    flowchart LR
        a[Chapter 1] --> b[Chapter 2] --> c[Chapter 3]
        c-->d[Using Ledger]
        c-->e[Using Trezor]
        d-->f[Chapter 4]
        e-->f
    ```
````

### Simple Left-Right Graph

```mermaid
graph LR;
A-->B;
A-->C;
B-->D;
C-->D;
```

### Simple Graph to Mark Chapters

```mermaid
flowchart LR
    a[Chapter 1] --> b[Chapter 2] --> c[Chapter 3]
    c-->d[Using Ledger]
    c-->e[Using Trezor]
    d-->f[Chapter 4]
    e-->f
```

### Simple Top-Down Graph

```mermaid
graph TD;
A-->B;
A-->C;
B-->D;
C-->D;
```

### Dependency Sets

```mermaid
graph TB
    A & B--> C & D
```

### Binary Tree

```mermaid
graph TB
    A((1))-->B((2))
    A-->C((3))
    B-->D((4))
    B-->E((5))
    C-->F((6))
    C-->G((7))
    D-->H((8))
    D-->I((9))
    E-->J((10))
```

### Graph Shape & Link Variants

```mermaid
graph LR
    A[Square Rect] -- Link text --> B((Circle))
    A --> C(Round Rect)
    B --> D{Rhombus}
    C --> D
```

### Basic Flowchart

```mermaid
graph TB
    A[Start] ==> B{Is it?};
    B -->|Yes| C[OK];
    C --> D[Rethink];
    D -.-> B;
    B ---->|No| E[End];
```

### More complex Flowchart "Coffee Machine Not Working?"

```mermaid
graph TD
   A(Coffee machine <br>not working) --> B{Machine has power?}
   B -->|No| H(Plug in and turn on)
   B -->|Yes| C{Out of beans or water?} -->|Yes| G(Refill beans and water)
   C -->|No| D{Filter warning?} -->|Yes| I(Replace or clean filter)
   D -->|No| F(Send for repair)
```

### Flowchart with Hyperlinks

Notes:

- Hyperlinks in labels while using Github's Mermaid are not by default visually different.
- Tooltips, callbacks and other [interaction features](https://mermaid-js.github.io/mermaid/#/flowchart?id=interaction) of Mermaid do not seem to function Github's Mermaid.
- Relative and internal hyperlinks do not seem to function properly in Github's Mermaid, they must be full links.
- To be safe, you should use quote around any label text that have symbols in them, in particular parenthesis & various brackets `A-->B["This is a (test).]"` and any non-ASCII characters (use HTML Entities instead such as `&dagger;` is † `&#128279;` is 🔗.
- TBD: Create a better example and document how to make hyperlinks work better within the limits of what GitHub's Mermaid supports, and come up some work-arounds for best practices (maybe some Mermaid styling trick like underlines. (see https://github.com/mermaid-js/mermaid/issues/2870 ).

```mermaid
flowchart LR;
    A-->B["B#dagger; (internal link)"];
    B-->C;
    C-->D["D#ddagger; (external link)"];
    click B "https://gist.github.com/ChristopherA/bffddfdf7b1502215e44cec9fb766dfd/#flowchart-with-hyperlinks"
    click D "https://gist.github.com/ChristopherA/"
```

### More Complex Example

```mermaid
  flowchart LR;
      A[CI MULTI CHAPTCHA]-->B{Select captcha service by developer?};
      classDef green color:#022e1f,fill:#00f500;
      classDef red color:#022e1f,fill:#f11111;
      classDef white color:#022e1f,fill:#fff;
      classDef black color:#fff,fill:#000;
      B--YES-->C[How to use?]:::green;

      C-->U[I choose recaptcha.]:::green;
      U--Views-->Q["echo CIMC_JS('recaptcha');\n echo CIMC_HTML(['captcha_name'=>'recaptcha']);"]:::green;
      U--Controller-->W["CIMC_RULE('recaptcha');"]:::green;

      C-->I[I choose arcaptcha.]:::white;
      I--Views-->O["echo CIMC_JS('arcaptcha');\n echo CIMC_HTML(['captcha_name'=>'arcaptcha']);"]:::white;
      I--Controller-->P["CIMC_RULE('arcaptcha');"]:::white;

      C-->X[I choose bibot.]:::red;
      X--Views-->V["echo CIMC_JS('bibot');\n echo CIMC_HTML(['captcha_name'=>'bibot']);"]:::red;
      X--Controller-->N["CIMC_RULE('bibot');"]:::red;

      B--NO-->D[How to use?]:::black;
      D---Views:::black-->F["echo CIMC_JS('randomcaptcha');\n echo CIMC_HTML(['captcha_name'=>'randomcaptcha']);"]:::black;
      D---Controller:::black-->T["CIMC_RULE('archaptcha,recaptcha,bibot');"]:::black;
```

### Subgraph

```mermaid
graph TB
    c1-->a2
    subgraph one
    a1-->a2
    end
    subgraph two
    b1-->b2
    end
    subgraph three
    c1-->c2
    end
```

### Themed Subgraph

```mermaid
graph LR
    subgraph 1[System Flow]
        CP([Command Palette])
        subgraph 2[Black Box]
            QA(Quick Addition)
            QM(Macro)
        end
        B[Call Script]
        C[Open URI]
        D[Load Workspace]
        CP --> QA --> QM --> B --> C --> D
    end
style 1 fill:#333333,stroke:#FFFFFF,stroke-width:2px
style 2 fill:#222222,stroke:#FFFFFF,stroke-width:1px
```

### Flowchart with Styling

```mermaid
graph TB
    sq[Square shape] --> ci((Circle shape))

    subgraph A
        od>Odd shape]-- Two line<br/>edge comment --> ro
        di{Diamond with <br/> line break} -.-> ro(Rounded<br>square<br>shape)
        di==>ro2(Rounded square shape)
    end

    %% Notice that no text in shape are added here instead that is appended further down
    e --> od3>Really long text with linebreak<br>in an Odd shape]

    %% Comments after double percent signs
    e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

    cyr[Cyrillic]-->cyr2((Circle shape Начало));

     classDef green fill:#9f6,stroke:#333,stroke-width:2px;
     classDef orange fill:#f96,stroke:#333,stroke-width:4px;
     class sq,e green
     class di orange
```

### Decision Tree

(from: <https://bionicteaching.com/gravity-forms-mermaid-decision-flowcharts/> )

```mermaid
graph TB
A("Do you think online service
learning is right for you?")
B("Do you have time to design
a service learning component?")
C("What is the civic or public purpose of your discipline?
How do you teach that without service learning?")
D("Do you have departmental or school
support to plan and implement service learning?")
E["Are you willing to be a trailblazer?"]
F["What type of service learning to you want to plan?"]

A==Yes==>B
A--No-->C
B==Yes==>D
B--No-->E
D--Yes-->F
D--No-->E
E--Yes-->F
E--No-->C
```

### Styled Links

(from [StackOverflow](https://stackoverflow.com/questions/68452674/style-multiple-links-mermaid-js))

```mermaid
graph TD
    Bat(fa:fa-car-battery Batteries) -->|150a 50mm| ShutOff
    Bat -->|150a 50mm| Shunt

    ShutOff[Shut Off] -->|150a 50mm| BusPos[Bus Bar +]

    Shunt -->|150a 50mm| BusNeg[Bus Bar -]

    BusPos -->|40a| Fuse[Fuse Box]
    BusPos -->|?a| Old{Old Wiring}

    BusNeg -->|40a| Fuse

    Fuse -->|10a| USB(USB-C)
    Fuse -->|10a| USB
    Fuse -->|1.5a| Switch -->|1.5a| Wifi

    Wifi -->|1.5a| Fuse

    Fuse -->|10a| Cig1[Cigarette Lighter]
    Fuse -->|10a| Cig1

    Fuse -->|10a| Cig2[Cigarette Lighter Near Bed]
    Fuse -->|10a| Cig2

    BusNeg -->|?a| Old

    Solar --> SolarCont[Solar Controller]
    Solar --> SolarCont

    SolarCont --> BusNeg
    SolarCont --> BusPos

    linkStyle 0,1,2,4,5,8,9 stroke-width:2px,fill:none,stroke:red;
    linkStyle 3,6,7 stroke-width:2px,fill:none,stroke:black;
    linkStyle 10 stroke-width:2px,fill:none,stroke:red;
    linkStyle 11 stroke-width:2px,fill:none,stroke:green;
    linkStyle 12 stroke-width:2px,fill:none,stroke:red;
    linkStyle 13 stroke-width:2px,fill:none,stroke:green;
    linkStyle 14 stroke-width:2px,fill:none,stroke:red;
    linkStyle 15 stroke-width:2px,fill:none,stroke:green;
    linkStyle 16 stroke-width:2px,fill:none,stroke:green;
    linkStyle 17 stroke-width:2px,fill:none,stroke:red;
    linkStyle 18 stroke-width:2px,fill:none,stroke:green;
    linkStyle 19 stroke-width:2px,fill:none,stroke:green;
```

## [Sequence Diagram](https://mermaid-js.github.io/mermaid/#/sequenceDiagram)

```mermaid
sequenceDiagram
Alice ->> Bob: Hello Bob, how are you?
Bob-->>John: How about you John?
Bob--x Alice: I am good thanks!
Bob-x John: I am good thanks!
Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

Bob-->Alice: Checking with John...
Alice->John: Yes... John, how are you?
```

### Three-way Handshake (Sequence Diagram)

```mermaid
sequenceDiagram
  participant c as Client
  participant s as Server

  c->>s: SYN
  note over c, s: SEQ1 = 100<br>ACK1 not set
  s->>c: SYN+ACK
  note over c, s: SEQ2 = 300<br>ACK2 = 100+1 = 101
  c->>s: ACK
  note over c, s: SEQ3 = 101<br>ACK3 = 300+1 = 301
```

```mermaid
sequenceDiagram
A->> B: Query
B->> C: Forward query
Note right of C: Thinking...
C->> B: Response
B->> A: Forward response
```

### How mermaid is generated by Github

```mermaid
sequenceDiagram
    participant dotcom
    participant iframe
    participant viewscreen
    dotcom->>iframe: loads html w/ iframe url
    iframe->>viewscreen: request template
    viewscreen->>iframe: html & javascript
    iframe->>dotcom: iframe ready
    dotcom->>iframe: set mermaid data on iframe
    iframe->>iframe: render mermaid
```

### Sequence with Loop & Notes

```mermaid
sequenceDiagram
    autonumber
    Student->>Admin: Can I enrol this semester?
    loop enrolmentCheck
        Admin->>Admin: Check previous results
    end
    Note right of Admin: Exam results may <br> be delayed
    Admin-->>Student: Enrolment success
    Admin->>Professor: Assign student to tutor
    Professor-->>Admin: Student is assigned
```

## [Class Diagram](https://mermaid-js.github.io/mermaid/#/classDiagram)

```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }
```

## [State Diagram](https://mermaid-js.github.io/mermaid/#/stateDiagram)

### Simple State Diagram

```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```

### More Complex

```mermaid
stateDiagram-v2
  [*] --> Unwritten

  Unwritten --> Open: Open
  Unwritten --> Void: Void

  Open --> Void: Void
  Open --> Cancelled: Cancel
  Open --> Closed: Close
  Open --> Open: Update

  Closed --> Open: Open
```

```mermaid
stateDiagram-v2
    [*] --> First
    state First {
        [*] --> second
        second --> [*]
    }
```

```mermaid
 stateDiagram-v2
    state fork_state <<fork>>
      [*] --> fork_state
      fork_state --> State2
      fork_state --> State3

      state join_state <<join>>
      State2 --> join_state
      State3 --> join_state
      join_state --> State4
      State4 --> [*]
```

```mermaid
stateDiagram-v2
        State1: The state with a note
        note right of State1
            Important information! You can write
            notes.
        end note
        State1 --> State2
        note left of State2 : This is the note to the left.
```

## Shipment Status

```mermaid
stateDiagram-v2
  direction LR
  [*] --> Initialed
  Initialed --> SellerSent
  SellerSent --> Transported
  Transported --> BuyerPicked
  BuyerPicked --> Delivered
  Delivered --> [*]

  BuyerPicked --> BuyerSent
  BuyerSent --> ReturnTransported
  ReturnTransported --> SellerPicked
  SellerPicked --> [*]

  Transported --> ReturnTransported: buyer doesn'y pick up the item after 1 week
```

## [Gantt Diagram](https://mermaid-js.github.io/mermaid/#/gantt)

```mermaid
gantt
 title Example Gantt diagram
    dateFormat  YYYY-MM-DD
    section Team 1
    Research & requirements :done, a1, 2020-03-08, 2020-04-10
    Review & documentation : after a1, 20d
    section Team 2
    Implementation      :crit, active, 2020-03-25  , 20d
    Testing      :crit, 20d
```

### Another GANTT Diagram

```mermaid
gantt
dateFormat  YYYY-MM-DD
title Adding GANTT diagram to mermaid
excludes weekdays 2014-01-10

section A section
Completed task            :done,    des1, 2014-01-06,2014-01-08
Active task               :active,  des2, 2014-01-09, 3d
Future task               :         des3, after des2, 5d
Future task2               :         des4, after des3, 5d
```

## [Entity Relationship Diagram](https://mermaid-js.github.io/mermaid/#/entityRelationshipDiagram)

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        string name
        string custNumber
        string sector
    }
    ORDER ||--|{ LINE-ITEM : contains
    ORDER {
        int orderNumber
        string deliveryAddress
    }
    LINE-ITEM {
        string productCode
        int quantity
        float pricePerUnit
    }
```

```mermaid
erDiagram
          CUSTOMER }|..|{ DELIVERY-ADDRESS : has
          CUSTOMER ||--o{ ORDER : places
          CUSTOMER ||--o{ INVOICE : "liable for"
          DELIVERY-ADDRESS ||--o{ ORDER : receives
          INVOICE ||--|{ ORDER : covers
          ORDER ||--|{ ORDER-ITEM : includes
          PRODUCT-CATEGORY ||--|{ PRODUCT : contains
          PRODUCT ||--o{ ORDER-ITEM : "ordered in"
```

## [User Journey Diagram](https://mermaid-js.github.io/mermaid/#/user-journey)

```mermaid
  journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me
```

## [Pie Chart Diagram](https://mermaid-js.github.io/mermaid/#/pie)

```mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

## [Requirement diagram](https://mermaid-js.github.io/mermaid/#/requirementDiagram)

```mermaid
requirementDiagram

    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req
```

## GitGraph

This does not seem to be documented, see [#2011](https://github.com/mermaid-js/mermaid/issues/2011).

```mermaid
gitGraph
    commit
    branch newbranch
    checkout newbranch
    commit
    commit
    checkout main
    commit
    commit
    merge newbranch
```
