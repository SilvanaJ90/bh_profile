let app_words = {
    backend: 'http://127.0.0.1:5001/api/v1',
    table : null,
    init: function() {
          // Get the id parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('category_id');

        // Set the title to the category name
        const $title = document.querySelector("#crud-title");
        $.ajax({
            url: app_words.backend + '/categories/' + categoryId,
            success: function(category) {
                $title.textContent = 'Palabras de la categoría: ' + category.name;
            }
        });

        // Use the categoryId to set the url property of the ajax option
        app_words.initDatatable('#words', app_words.backend + '/categories/' + categoryId + '/words');

        // Add event listeners for the save and update buttons
        $("#Wordsave").click(function(){
            app_words.Wordsave(app_words.backend + '/categories/' + categoryId + '/words', {
                name : $('#WordName').val()
            });
        });
        $("#WordSavePut").click(function(){
            app_words.WordSavePut({
                id : $('#WordIdPut').val(),
                name : $('#WordNamePut').val()
            });
        });
    },
    initDatatable : function(id, url) {
        app_words.table = $(id).DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
            ajax : {
                url: url,
                dataSrc : function(json) {
                    return json;
                }
            },
            dom: 'Bfrtip',
            columns: [                     
                {
                    data : null, "render": function (data, type, full, meta) {
                        return meta.row + 1;
                    }
                },
                {data : 'name'}
                
            ],
            
        
            buttons: [

                {
                    text : '<i class="fa-solid fa-chevron-left"></i>',
                    action : function(e, dt, node, config) {
                        location.href="admin";
                    }
                },

                {
                    text : '<i class="fa-solid fa-plus"></i>',
                    action : function(e, dt, node, config) {
                        app_words.cleanForm();
                        $('#wordModal').modal();
                    }
                },
                {
                    text : '<i class="fa-solid fa-trash-can"></i>',
                    action : function(e, dt, node, config) {
                        let data = dt.rows('.table-active').data()[0];
                        swal({
                            title: "¿Estás seguro de que deseas eliminar la categoría?",
                            text: "",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                            position: 'center',
                          })
                          .then((willDelete) => {
                            if (willDelete) {
                              swal('Eliminado exitosamente', '', 'success')
                              app_words.delete(data.id)
                            }
                          });
                    }
                },

                {
                    text : '<i class="fa-solid fa-pencil"></i>',
                    action : function(e, dt, node, config) {
                        let data = dt.rows('.table-active').data()[0];
                        app_words.setDataToModalPut(data);
                        $('#wordPutModal').modal();
                    }
                }
            ]
        });
        $('#words tbody').on('click', 'tr', function(){
            if ($(this).hasClass('table-active')) {
                $(this).removeClass('table-active');
            } else {
                app_words.table.$('tr.table-active').removeClass('table-active');
                $(this).addClass('table-active');
            }
        });

    },
    setDataToModal : function(data) {

        $('#WordName').val(data.name);
    },
    setDataToModalPut : function(data) {
        $('#WordIdPut').val(data.id);
        $('#WordNamePut').val(data.name);
    },
    cleanForm: function(){
        $('#WordName').val('');

    },
    Wordsave : function(url, data) {
        $.ajax({
            url: url,
            data : JSON.stringify(data),
            method: 'POST',
            dataType : 'json',
            contentType: "application/json; charset=utf-8",
            success : function(json) {
                $("#msg").css("color", "#000");
                $("#msg").css("background-color", "#97fcb0");
                $("#msg").css("border", "#000 solid 1px");
                $("#msg").text('Se guardó la categoría correctamente');
                $("#msg").show();
                $('#wordModal').modal('hide');
                app_words.table.ajax.reload();
            },
            error : function(error) {
                $("#msg").css("color", "#000");
                $("#msg").css("background-color", "#fc97a4");
                $("#msg").css("border", "#000 solid 1px");
                $("#msg").text(error.error);
                $("#msg").text('(ERROR) Excede el numero de caracteres permitidos');
                $("#msg").show();

            }
        })
    },

    WordSavePut : function(data) {
        $.ajax({
            url: app_words.backend + '/words/' + data.id,
            data : JSON.stringify(data),
            method: 'PUT',
            dataType : 'json',
            contentType: "application/json; charset=utf-8",
            success : function(json) {
                $("#msg").css("color", "#000");
                $("#msg").css("background-color", "#97fcb0");
                $("#msg").css("border", "#000 solid 1px");
                $("#msg").text('La categoría se actualizó correctamente');
                $("#msg").show();
                $('#wordPutModal').modal('hide');
                app_words.table.ajax.reload();
            },
            error : function(xhr, status, error) {
                console.log(error);
                $("#msg").css("color", "#fff");
                $("#msg").css("background-color", "#ff4d4d");
                $("#msg").css("border", "#000 solid 1px");
                $("#msg").text('Error al actualizar la categoría');
                $("#msg").show();
            }
        });

    },

    delete : function(id) {
        $.ajax({
            url: app_words.backend + '/words/'+id,
            method: 'DELETE',
            dataType : 'json',
            contentType: "application/json; charset=utf-8",
            success : function(json) {
                $("#msg").css("color", "#000");
                $("#msg").css("background-color", "#97fcb0");
                $("#msg").css("border", "#000 solid 1px");
                $("#msg").text('Se eliminó  la categoría correctamente');
                $("#msg").show();
                app_words.table.ajax.reload();
            },
            error : function(error) {
                $("#msg").css("color", "#000");
                $("#msg").css("background-color", "#fc97a4");
                $("#msg").css("border", "#000 solid 1px");
                $("#msg").text(error.error);
                $("#msg").show();

            }
        })
    },
    
};

$(document).ready(function(){
    app_words.init();
});
