---
title: Items Binding
page_title: Items Binding | Telerik UI Menu HtmlHelper for ASP.NET MVC
description: "Manually define the properties of each item in the Telerik UI Menu HtmlHelper for ASP.NET MVC by using the items builder."
slug: itemsbinding_menu_aspnetmvc
position: 2
---

# Items Binding

The Menu enables you to manually define the properties of each item.

1. Make sure you followed all the steps from the [introductory article on Telerik UI for ASP.NET MVC]({% slug overview_aspnetmvc %}).
1. Create a new action method which renders the view.

        public ActionResult Index()
        {
            return View();
        }

1. Add a simple Menu.

    ```ASPX
        <%: Html.Kendo().Menu()
            .Name("menu") // The name of the Menu is mandatory. It specifies the "id" attribute of the menu.
            .Items(items =>
            {
                items.Add().Text("Item 1"); // Add an item with the text "Item1".
                items.Add().Text("Item 2"); // Add an item with the text "Item2".
            })
        %>
    ```
    ```Razor
        @(Html.Kendo().Menu()
            .Name("menu") // The name of the Menu is mandatory. It specifies the "id" attribute of the Menu.
            .Items(items =>
            {
                items.Add().Text("Item 1"); // Add an item with the text "Item1".
                items.Add().Text("Item 2"); // Add an item with the text "Item2".
            }
        )
    ```

## See Also

* [Basic Usage of the Menu HtmlHelper for ASP.NET MVC (Demo)](https://demos.telerik.com/aspnet-mvc/menu)
* [MenuItemBuilder Server-Side API](http://docs.telerik.com/aspnet-mvc/api/Kendo.Mvc.UI.Fluent/MenuItemBuilder)
* [MenuBuilder Server-Side API](http://docs.telerik.com/aspnet-mvc/api/Kendo.Mvc.UI.Fluent/MenuBuilder)
* [Menu Server-Side API](/api/menu)
