/* =========================================================
   DLS ASSISTANT — RESPOSTAS (usadas no chat da página e no pop-up)
   Para mudar uma resposta, edite aqui. Baseado no briefing da DLS.
========================================================= */
function dlsGetAnswer(question){

    const q =
        question
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");



    /* respostas conforme o BRIEFING (específicas primeiro) */
    if(q.includes("garage") || q.includes("organiz") || q.includes("closet") || q.includes("outdoor area") || q.includes("patio clean") || q.includes("yard")){
        return `Thanks for asking! DLS does not offer outdoor area cleaning, garage cleaning, light organization or closet organization.<br><br>Our cleaning services are Regular Cleaning, Deep Cleaning and Commercial Cleaning, plus add-ons for interior windows, refrigerator and oven. Would you like to know more about any of them?`;
    }
    if(q.includes("difference") || (q.includes("regular") && q.includes("deep"))){
        return `Regular Cleaning is recurring maintenance (weekly, bi-weekly or monthly) to keep your home clean and pleasant.<br><br>Deep Cleaning includes everything from Regular Cleaning, plus detailed baseboards, blinds, ceiling fans, detailed kitchen and bathroom cleaning, neglected areas and hard-to-reach areas — ideal when a space hasn't had a detailed cleaning in a while.`;
    }
    if(q.includes("regular") || q.includes("included") || q.includes("what do you clean")){
        return `Our Regular Cleaning includes dusting, making beds, vacuuming carpets and rugs, vacuuming and mopping floors, cleaning countertops and sinks, cleaning cabinet exteriors, exterior appliance cleaning, complete bathroom cleaning, and trash removal.<br><br>It's available weekly, bi-weekly or monthly.`;
    }
    if(q.includes("deep clean")){
        return `Deep Cleaning includes everything from Regular Cleaning, plus detailed baseboard cleaning, blinds, ceiling fans, detailed kitchen cleaning, detailed bathroom cleaning, neglected areas and hard-to-reach areas.<br><br>It's ideal for spaces that haven't had a detailed cleaning in a while, or whenever you want a more complete clean.`;
    }
    if(q.includes("commercial") || q.includes("office") || q.includes("business")){
        return `Yes! DLS Services provides Commercial Cleaning — workstations, common areas, cafeterias, restrooms, trash and recycling, and floor maintenance.<br><br>It can be recurring or on-demand, and adapted to each company's needs.`;
    }
    if(q.includes("summer kitchen") || q.includes("outdoor kitchen")){
        return `Yes. Summer Kitchens are part of our Handyman & Remodeling services — they can involve construction, installation, finishing and structural improvements.<br><br>Each project is evaluated according to your space and needs.`;
    }
    if(q.includes("remodel") || q.includes("renovat")){
        return `DLS works with Residential Remodeling, Commercial Remodeling, Home Improvements, Space Renovation and General Property Improvements.<br><br>The scope is defined for each project. You can <a href="/#quote">request an estimate</a> and tell us about your plans.`;
    }
    if(q.includes("email") || q.includes("contact") || q.includes("instagram") || q.includes("phone") || q.includes("call")){
        return `You can reach DLS Services by email at <a href="mailto:contact@dlsservicesfl.com">contact@dlsservicesfl.com</a>, or <a href="/#quote">request an estimate</a> right here on the site.`;
    }
    if(q.includes("area") || q.includes("serve") || q.includes("location") || q.includes("where") || q.includes("orlando")){
        return `DLS Services serves Orlando, Florida and nearby areas.<br><br>Send your address through the <a href="/#quote">estimate request</a> and the DLS team will confirm availability for your location.`;
    }
    if(q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("pricing") || q.includes("discount")){
        return `DLS doesn't publish fixed prices — every estimate is personalized. It depends on the type of service, size of the space, amount of work, materials (quantity and quality), complexity, difficulty, urgency and your specific needs.<br><br>The best next step is to <a href="/#quote">request a free estimate</a>.`;
    }

    /* CLEANING */

    if(
        q.includes("cleaning") ||
        q.includes("clean my house") ||
        q.includes("house clean")
    ){

        return `
        DLS Services offers professional cleaning
        for residential and commercial spaces.

        We offer Regular Cleaning, Deep Cleaning,
        and Commercial Cleaning.

        Would you like to request a free estimate?
        `;

    }


    /* REGULAR CLEANING */

    if(
        q.includes("regular") ||
        q.includes("included") ||
        q.includes("what do you clean")
    ){

        return `
        Our Regular Cleaning includes dusting,
        making beds, vacuuming carpets and rugs,
        vacuuming and mopping floors, cleaning
        counters and sinks, exterior appliance
        cleaning, complete bathroom cleaning,
        and trash removal.

        We focus on the details that help your
        space feel fresh and cared for.
        `;

    }


    /* DEEP CLEANING */

    if(
        q.includes("deep clean") ||
        q.includes("deep cleaning")
    ){

        return `
        Deep Cleaning includes everything from
        Regular Cleaning, plus more detailed
        attention to areas that may have been
        neglected.

        This can include baseboards, blinds,
        ceiling fans, detailed kitchen cleaning,
        and detailed bathroom cleaning.

        It's ideal when your home needs extra
        attention.
        `;

    }


    /* COMMERCIAL */

    if(
        q.includes("commercial") ||
        q.includes("office") ||
        q.includes("business")
    ){

        return `
        Yes! DLS Services also provides
        Commercial Cleaning.

        Services can include workstations,
        common areas, cafeterias, restrooms,
        trash and recycling, and floor
        maintenance.

        Commercial cleaning can be arranged
        on a recurring or as-needed basis.
        `;

    }


    /* ADD-ONS */

    if(
        q.includes("window") ||
        q.includes("oven") ||
        q.includes("refrigerator") ||
        q.includes("fridge")
    ){

        return `
        DLS offers additional cleaning services
        such as interior window cleaning,
        refrigerator cleaning, and oven cleaning.

        These can be requested as add-ons
        depending on your cleaning needs.
        `;

    }


    /* FREQUENCY */

    if(
        q.includes("weekly") ||
        q.includes("bi-weekly") ||
        q.includes("biweekly") ||
        q.includes("monthly") ||
        q.includes("recurring")
    ){

        return `
        Yes. Regular Cleaning can be arranged
        on a recurring basis, including weekly,
        bi-weekly, or monthly service.

        Your estimate will depend on your home's
        specific needs.
        `;

    }


    /* PRICE */

    if(
        q.includes("price") ||
        q.includes("cost") ||
        q.includes("how much") ||
        q.includes("pricing")
    ){

        return `
        Every home and project is different,
        so DLS does not use one fixed price.

        The estimate depends on factors such as
        the type of service, size of the space,
        level of cleaning needed, materials,
        difficulty, and other project details.

        The best next step is to request a
        free estimate.
        `;

    }


    /* HANDYMAN */

    if(
        q.includes("handyman") ||
        q.includes("remodel") ||
        q.includes("renovation") ||
        q.includes("repair")
    ){

        return `
        DLS also offers Handyman & Remodeling
        services.

        Services include summer kitchens,
        drywall, finish and texture, masonry,
        carpentry, painting, demolition,
        appliance installation, general
        handyman services, and remodeling.

        Would you like to tell us about your project?
        `;

    }


    /* SUMMER KITCHEN */

    if(
        q.includes("summer kitchen") ||
        q.includes("outdoor kitchen")
    ){

        return `
        Yes. DLS offers Summer Kitchen projects
        as part of our Handyman & Remodeling
        services.

        Project estimates depend on the scope,
        materials, design, and installation
        requirements.
        `;

    }


    /* SERVICE AREA */

    if(
        q.includes("area") ||
        q.includes("serve") ||
        q.includes("location") ||
        q.includes("where")
    ){

        return `
        Service availability depends on the
        location and type of service.

        Send us your address through the
        estimate request and the DLS team can
        confirm availability.
        `;

    }


    /* APPOINTMENT */

    if(
        q.includes("appointment") ||
        q.includes("schedule") ||
        q.includes("book") ||
        q.includes("booking")
    ){

        return `
        You can request your preferred date
        and time when submitting your estimate
        request.

        Please note that the appointment is
        only confirmed after DLS confirms
        availability.
        `;

    }


    /* ESTIMATE */

    if(
        q.includes("estimate") ||
        q.includes("quote") ||
        q.includes("request") ||
        q.includes("free")
    ){

        return `
        Absolutely!

        To request a free estimate, click
        <a href="/#quote">Request a Free Estimate</a> or
        complete the quote form on this page.

        DLS will review your information and
        get back to you with the next steps.
        `;

    }


    /* HOURS */

    if(
        q.includes("hours") ||
        q.includes("open") ||
        q.includes("when")
    ){

        return `
        DLS Services operates Monday through
        Friday, with normal service starting
        at 8:00 AM.

        You can request your preferred date
        and time, and DLS will confirm
        availability.
        `;

    }


    /* GREETING */

    if(
        q.includes("hello") ||
        /\bhi\b/.test(q) ||
        q.includes("hey") ||
        q.includes("good morning") ||
        q.includes("good afternoon")
    ){

        return `
        Hi! It's great to hear from you.

        I'm here to help you learn more about
        DLS Services.

        You can ask me about cleaning,
        handyman services, pricing, or
        requesting an estimate.
        `;

    }


    /* FALLBACK */

    return `
    I'd be happy to help!

    I can answer questions about DLS cleaning
    services, deep cleaning, commercial cleaning,
    add-ons, recurring cleaning, handyman and
    remodeling services, estimates, and
    appointments.

    If you have a specific question, just
    type it below.

    If you're ready to get started, you can
    also request a free estimate.
    `;

}
