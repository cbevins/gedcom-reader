<script>
    import {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOptions,
    ListboxOption,
    } from "@rgossiaux/svelte-headlessui"
    import { fade } from "svelte/transition"

    const people = [
        { id: 1, name: "Durward Reynolds", unavailable: false },
        { id: 2, name: "Kenton Towne", unavailable: false },
        { id: 3, name: "Therese Wunsch", unavailable: false },
        { id: 4, name: "Benedict Kessler", unavailable: true },
        { id: 5, name: "Katelyn Rohan", unavailable: false },
    ]

    let selectedPerson = people[0];
    let selectedPerson4 = people[4];
</script>
<ul>
    <li><a href="/">Home</a></li>
    <li><a href="/fileupdown">File Upload Download</a></li>
</ul>
<hr> 
<h1>Basic Example</h1>
    <Listbox bind:value={selectedPerson}>
        <ListboxButton>{selectedPerson.name}</ListboxButton>
        <ListboxOptions>
            {#each people as person (person.id)}
            <ListboxOption value={person} disabled={person.unavailable}>
                {person.name}
            </ListboxOption>
        {/each}
        </ListboxOptions>
    </Listbox>
<hr>
<h1>Custom Label</h1>
<Listbox bind:value={selectedPerson}>
    <ListboxLabel>Assignee:</ListboxLabel>
    <ListboxButton>{selectedPerson.name}</ListboxButton>
    <ListboxOptions>
      {#each people as person (person.id)}
        <ListboxOption value={person}>
          {person.name}
        </ListboxOption>
      {/each}
    </ListboxOptions>
  </Listbox>
<hr>
 
<h1>Transitions</h1>
<Listbox
  bind:value={selectedPerson}
  let:open
>
  <ListboxButton>{selectedPerson.name}</ListboxButton>
  {#if open}
    <div transition:fade>
      <!-- When controlling the transition manually, make sure to use `static` -->
      <ListboxOptions static>
        {#each people as person (person.id)}
          <ListboxOption value={person}>
            {person.name}
          </ListboxOption>
        {/each}
      </ListboxOptions>
    </div>
  {/if}
</Listbox>